<template>
    <div class="h-screen">
        <div class="flex flex-row justify-between items-center w-full">
            <div class="flex w-full">
                <div class="flex flex-row justify-between w-full">
                    <div class="flex items-center gap-1.5">
                        <NumberField class="w-24" v-model="monthsBack">
                            <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                            </NumberFieldContent>
                        </NumberField>
                        <Select v-model="selectedStatus">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="state in status" :value="state.value">
                                    {{ state.label }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <Select  v-model="pageSize">
                            <SelectTrigger class="w-[80px]">
                                <SelectValue placeholder="Page Size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="size in pageSizeSelect" :value="size">
                                    {{ size }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div>
                            <Button variant="secondary" @click="changePage(currentPage-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                            <Button variant="secondary" @click="changePage(currentPage+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                        </div>
                        <Button variant="outline" @click="printBatches()" class="flex items-center gap-2">
                            <Icon name="lucide:printer" class="w-4 h-4" />
                            Print
                        </Button>
                        <MyPaymentSortPopover />
                    </div>
                </div>
            </div>
        </div>
        <hidden>
            search pages {{ totalPages }} current page {{ currentPage }} page size {{ pageSize }}
        </hidden>
        <MySkeletenCardList v-if="isLoading" :columns="8"/>
        <div v-else>
            <div class="flex flex-row justify-between w-full items-center bg-gray-50 p-1 my-1 rounded">
                <p class="font-bold">
                    {{ rangeStart }} - {{ rangeEnd }}
                </p>
                <p class="w-fit text-center font-bold">
                    <Badge>{{ totalBatches  }}</Badge>
                    {{ totalBatchesAmount }}
                </p>
            </div>
            <MyBatchCard v-for="batch in paginatedBatch" :batch="batch"/>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
const { debounce } = _;
definePageMeta({
    layout: 'account'
})
export default{
    data(){
        return {
            isLoading: true,
            batches: [],
            monthsBack: 1,
            status: [
                {
                    label: "Any",
                    value: -1
                },{
                    label: "Submit",
                    value: 5,
                },{
                    label: "Settled",
                    value: 10
                },{
                    label: "Cancelled",
                    value: 99
                }
            ],
            selectedStatus: -1,
            pageSize: 10,
            pageSizeSelect: [
                10,50,100,200
            ],
            currentPage: 1,
            totalBatches: 0,
            totalBatchesAmount: 0,
            rangeStart: '',
            rangeEnd: ''

        }
    },
    methods:{
        async getBatch(){
            this.isLoading = true
            const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/GetCurrentBatchList`,{
                method: "GET",
                params: {
                    "GoBackMonths" : this.monthsBack,
                    "BatchPaymentState" : this.selectedStatus
                },
            });
            console.log(result)
            this.batches = result.batchList;
            this.batches.sort((a, b) => new Date(b.batchSubmissionDate) - new Date(a.batchSubmissionDate));
            this.totalBatches = this.batches.length
            this.rangeStart = this.dateFormatter(result.rangeSelectStartDate)
            this.rangeEnd = this.dateFormatter(result.rangeSelectEndDate)
            this.isLoading = false;
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        dateFormatter(date){
            return new Date(date).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        async printBatches() {
            try {
                // Show loading toast
                this.$toast({
                    title: 'Generating PDF',
                    description: 'Please wait while we create your batch report...',
                    variant: "default"
                });
                
                // Generate PDF
                await this.generateBatchPDF();
                
                // Show success toast
                this.$toast({
                    title: 'PDF Generated',
                    description: 'Your batch report has been downloaded',
                    variant: "success"
                });
                
            } catch (error) {
                console.error('Error generating PDF:', error);
                this.$toast({
                    title: 'PDF Error',
                    description: 'Failed to generate PDF report',
                    variant: "destructive"
                });
            }
        },
        async generateBatchPDF() {
            // Dynamically import jsPDF to avoid SSR issues
            const { jsPDF } = await import('jspdf');
            const { autoTable } = await import('jspdf-autotable');
            
            const currentDate = new Date().toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Calculate totals
            const totalAmount = this.batches.reduce((sum, batch) => {
                return sum + (parseFloat(batch.payeePayOutAmount) || 0);
            }, 0).toFixed(2);
            
            // Generate status summary
            const statusSummary = this.selectedStatus === -1 ? 'All Statuses' : 
                this.status.find(s => s.value === this.selectedStatus)?.label || 'Unknown Status';
            
            // Create PDF document
            const doc = new jsPDF();
            
            // Add header
            doc.setFontSize(20);
            doc.text('Batch Payment Report', 105, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.text(`Generated on: ${currentDate}`, 20, 35);
            doc.text(`Period: ${this.rangeStart} - ${this.rangeEnd}`, 20, 42);
            doc.text(`Status Filter: ${statusSummary}`, 20, 49);
            
            // Add summary
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Summary:', 20, 65);
            doc.setFont(undefined, 'normal');
            doc.text(`Total Batches: ${this.batches.length}`, 20, 75);
            doc.text(`Total Amount: R ${totalAmount}`, 20, 82);
            
            // Prepare table data
            const tableData = this.batches.map(batch => [
                batch.batchPaymentID || 'N/A',
                this.formatDate(batch.batchSubmissionDate),
                this.getStatusLabel(batch.batchPaymentState),
                batch.paymentCount || 0,
                `R ${(parseFloat(batch.payeePayOutAmount) || 0).toFixed(2)}`,
                batch.batchComment || ''
            ]);
            
            // Add total row
            tableData.push(['', '', 'TOTAL', this.batches.length, `R ${totalAmount}`, '']);
            
            // Add table
            autoTable(doc, {
                head: [['Batch ID', 'Submission Date', 'Status', 'Payments', 'Amount', 'Comments']],
                body: tableData,
                startY: 90,
                styles: {
                    fontSize: 8,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    4: { halign: 'right' } // Amount column right-aligned
                },
                didParseCell: function(data) {
                    // Make total row bold
                    if (data.row.index === tableData.length - 1) {
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                }
            });
            
            // Generate filename
            const filename = `batch_report_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Save PDF
            doc.save(filename);
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        getStatusLabel(statusValue) {
            const status = this.status.find(s => s.value === statusValue);
            return status ? status.label : 'Unknown';
        },
    },
    async mounted(){
        await this.getBatch()
    },
    computed:{
        totalPages() {
            return Math.ceil(this.batches.length / this.pageSize);
        },
        paginatedBatch() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.batches.slice(startIndex, endIndex); // Paginate filtered payments
        },
        totalBatchesAmount() {
            return this.batches.reduce((total, batch) => {
                return total + (parseFloat(batch.payeePayOutAmount) || 0); // Replace 'amount' with the correct property name
            }, 0).toFixed(2); // Format to two decimal places
        },
    },
    watch: {
        async monthsBack(newValue) {
            if (newValue < 1) {
                this.monthsBack = 1; // Reset to 1 if the new value is less than 1
            } else {
                await this.getBatch(); // Call getPayments whenever monthsBack changes and is valid
            }
        },
        async selectedStatus(newValue){
            //console.log(newValue)
            await this.getBatch()
        }
    },
}
</script>
<style>
hidden{
    display: none;
}
</style>