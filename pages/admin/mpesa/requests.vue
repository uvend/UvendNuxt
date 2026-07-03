<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                    <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
                    <div class="flex flex-row gap-1">
                        <Button variant="secondary" @click="toggleSearch"><Icon name="lucide:search"/></Button>
                        <Input type="text" placeholder="Search" v-if="searchActive" v-model="search" @input="debouncedSearch"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-row w-fit items-center gap-2">
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
                <div class="flex flex-row gap-1">
                    <Button variant="secondary" @click="changePage(page-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                    <Button variant="secondary" @click="changePage(page+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                </div>
                <Button
                    size="icon"
                    class="border-0 shadow-sm text-white hover:text-white focus-visible:ring-green-600"
                    :class="whatsappLinked
                        ? 'bg-green-600 hover:bg-green-600'
                        : 'bg-red-600 hover:bg-red-600'"
                    :title="whatsappLinked ? 'WhatsApp connected' : 'WhatsApp not connected'"
                    @click="whatsappDialogOpen = true"
                >
                    <Icon name="simple-icons:whatsapp" class="h-5 w-5" />
                </Button>
            </div>
        </div>
    </div>

    <Dialog :open="whatsappDialogOpen" @update:open="whatsappDialogOpen = $event">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    WhatsApp
                    <Badge
                        variant="secondary"
                        :class="whatsappLinked ? 'border-transparent bg-green-600 text-white hover:bg-green-600' : ''"
                    >
                        {{ whatsappStatusLabel }}
                    </Badge>
                </DialogTitle>
                <DialogDescription>
                    Link WhatsApp to send M-Pesa notifications when connected.
                </DialogDescription>
            </DialogHeader>

            <div class="flex flex-col gap-3">
                <div v-if="whatsappLoading" class="text-sm text-muted-foreground">
                    Loading WhatsApp status…
                </div>
                <template v-else>
                    <div v-if="whatsappError" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {{ whatsappError }}
                    </div>

                    <div class="grid gap-1 text-sm">
                        <p v-if="whatsappStatus?.session">
                            <span class="text-muted-foreground">Session:</span>
                            {{ whatsappStatus.session }}
                        </p>
                        <p v-if="whatsappStatus?.primaryChannel">
                            <span class="text-muted-foreground">Primary channel:</span>
                            {{ whatsappPrimaryChannelLabel }}
                        </p>
                        <p v-if="whatsappAccountLabel">
                            <span class="text-muted-foreground">Account:</span>
                            {{ whatsappAccountLabel }}
                        </p>
                        <p v-if="whatsappStatus?.message" class="text-muted-foreground">
                            {{ whatsappStatus.message }}
                        </p>
                        <p v-if="whatsappFailed" class="text-destructive">
                            The WhatsApp session failed. Restart linking and scan the QR code again.
                        </p>
                    </div>

                    <div v-if="whatsappQrSrc" class="flex flex-col items-center gap-2">
                        <p class="text-sm text-muted-foreground">
                            Scan this QR code in WhatsApp on your phone.
                        </p>
                        <img
                            :src="whatsappQrSrc"
                            alt="WhatsApp QR code"
                            class="h-56 w-56 rounded-md border bg-white p-2"
                        />
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <Button
                            v-if="!whatsappLinked"
                            :disabled="whatsappActionLoading"
                            @click="startWhatsAppLink"
                        >
                            {{ whatsappLinkButtonLabel }}
                        </Button>
                        <Button
                            v-if="whatsappAwaitingQr"
                            variant="secondary"
                            :disabled="whatsappActionLoading"
                            @click="refreshWhatsAppQr"
                        >
                            Refresh QR
                        </Button>
                        <Button
                            v-if="whatsappLinked"
                            variant="destructive"
                            :disabled="whatsappActionLoading"
                            @click="unlinkWhatsApp"
                        >
                            {{ whatsappActionLoading ? 'Unlinking…' : 'Unlink' }}
                        </Button>
                    </div>

                    <div v-if="whatsappLinked" class="flex flex-col gap-2 border-t pt-3">
                        <p class="text-sm font-medium">Send test message</p>
                        <Input
                            v-model="whatsappTestPhone"
                            type="text"
                            placeholder="Phone number (e.g. 254712345678)"
                        />
                        <Input
                            v-model="whatsappTestMessage"
                            type="text"
                            placeholder="Message"
                            disabled
                        />
                        <Button
                            variant="secondary"
                            class="w-fit"
                            :disabled="whatsappTestLoading || !whatsappTestPhone.trim()"
                            @click="sendWhatsAppTestMessage"
                        >
                            {{ whatsappTestLoading ? 'Sending…' : 'Send test message' }}
                        </Button>
                    </div>
                </template>
            </div>
        </DialogContent>
    </Dialog>
    <MySkeletenCardList v-if=isLoading />
    <div v-else>
        <div class="flex justify-end pt-2">
            <div v-if="smsCreditValue != null" class="flex flex-col text-right">
                <p class="text-sm">{{ smsCreditLabel }}</p>
                <p class="text-base font-bold">{{ smsCreditValue }}</p>
            </div>
            <div v-else-if="smsCreditMessage" class="flex flex-col text-right">
                <p class="text-sm text-muted-foreground">{{ smsCreditMessage }}</p>
            </div>
        </div>
        <Dialog v-for="request in requests"
                :open="activeDialogRequestId === request.id"
                @update:open="val => activeDialogRequestId = val ? request.id : null">
            <DialogTrigger as-child>
                <Card  class="p-2 my-2 mpesa-request-card items-center">
                    <div v-if="request.Endpoint == 'v'" class="text-center">
                        <Icon name="lucide:shield" />
                    </div>
                    <div v-if="request.Endpoint == 'c'" class="text-center">
                        <Icon name="lucide:shield-check" />
                    </div>
                    <div class="font-bold">{{ request.TransID }}</div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex">Business Code</p>
                            <p class="text-base font-bold">{{ request.BusinessShortCode }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-left">
                        <div>
                            <p class="text-sm flex">Bill Ref</p>
                            <p class="text-base font-bold">{{ request.BillRefNumber }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-left">
                        <div>
                            <p class="text-sm flex">Phone</p>
                            <p class="text-base font-bold">{{ request.MSISDN }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex justify-end">Amount</p>
                            <p class="text-base font-bold">{{ request.TransAmount }}</p>
                        </div>
                    </div>
                    <div class="text-center">
                        {{ formattedTime(request.CreatedAt) }}<br>
                        {{ formatedDate(request.CreatedAt) }}
                    </div>
                    <div class="font-bold">{{ request.StatusCode }}</div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ request.TransID }}</DialogTitle>
                    <DialogDescription>
                        {{ formattedTime(request.CreatedAt) }} {{ formatedDate(request.CreatedAt) }}
                    </DialogDescription>
                </DialogHeader>
                <div class="formatted-text">
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Business Code</p>
                        <p class="ml-4">{{ request.BusinessShortCode }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Bill Reference</p>
                        <p class="ml-4">{{ request.BillRefNumber }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Phone Number</p>
                        <p class="ml-4">{{ request.MSISDN }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Amount</p>
                        <p class="ml-4">{{ request.TransAmount }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid" v-if="request.StatusCode">
                        <p class="font-bold">Status Code</p>
                        <p class="ml-4">{{ request.StatusCode }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Endpoint</p>
                        <p class="ml-4">{{ request.Endpoint === 'v' ? 'Validation' : 'Confirmation' }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Message</p>
                        <p class="ml-4" v-html="getRequestMessage(request)"></p>
                    </div>
                    <div class="dialog-mpesa-request-grid" v-if="getRequestTokens(request)">
                        <p class="font-bold">Token</p>
                        <p class="ml-4">{{ getRequestTokens(request) }}</p>
                    </div>
                </div>
                <DialogFooter class="flex">
                    <Button @click="resend(request.id)" v-if="request.Message" class="w-full">
                        Resend SMS
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
        return{
            page: 1,
            pageSize: 10,
            pageSizeSelect: [
                10,50,100
            ],
            isLoading: true,
            requests: [],
            totalPages: 0,
            dateRange: {
                start: new Date(new Date().setDate(new Date().getDate()-30)).toISOString(),
                end: new Date().toISOString()
            },
            smsCreditLabel: 'SMS Balance',
            smsCreditValue: null,
            smsCreditMessage: '',
            searchActive: false,
            search: '',
            hasNextPage: false,
            activeDialogRequestId: null,
            whatsappLoading: true,
            whatsappActionLoading: false,
            whatsappStatus: null,
            whatsappQr: null,
            whatsappError: '',
            whatsappPollTimer: null,
            whatsappLinkingRequested: false,
            whatsappTestPhone: '',
            whatsappTestMessage: 'Test message from Uvend M-Pesa.',
            whatsappTestLoading: false,
            whatsappDialogOpen: false,
        }
    },
    computed: {
        whatsappLinked() {
            return Boolean(this.whatsappStatus?.linked);
        },
        whatsappAwaitingQr() {
            return !this.whatsappLinked && this.whatsappStatus?.status === 'SCAN_QR_CODE';
        },
        whatsappStatusLabel() {
            if (this.whatsappLinked) return 'Linked';
            const status = this.whatsappStatus?.status;
            if (status === 'SCAN_QR_CODE') return 'Scan QR code';
            if (status === 'NOT_CREATED') return 'Not linked';
            if (status === 'STARTING' || status === 'STARTED' || status === 'OPENING' || status === 'PAIRING' || status === 'CONNECTING') return 'Connecting…';
            if (status === 'LOGGED_OUT') return 'Logged out';
            if (status === 'FAILED') return 'Session failed';
            if (status === 'STOPPED') return 'Stopped';
            return status || 'Unknown';
        },
        whatsappFailed() {
            return !this.whatsappLinked && this.whatsappStatus?.status === 'FAILED';
        },
        whatsappLinkButtonLabel() {
            if (this.whatsappActionLoading) return 'Starting…';
            if (this.whatsappFailed || this.whatsappStatus?.status === 'STOPPED') return 'Restart linking';
            return 'Link WhatsApp';
        },
        whatsappPrimaryChannelLabel() {
            const channel = this.whatsappStatus?.primaryChannel;
            if (channel === 'whatsapp') return 'WhatsApp';
            if (channel === 'sms') return 'SMS';
            return channel || '—';
        },
        whatsappAccountLabel() {
            const me = this.whatsappStatus?.me;
            if (!me) return '';
            return me.pushName || me.name || me.id || '';
        },
        whatsappQrSrc() {
            return this.qrImageSrc(this.whatsappQr);
        },
    },
    methods:{
        toggleSearch(){
            this.searchActive = !this.searchActive
        },
        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        },
        /** Base URL for M-Pesa API (no trailing slash). */
        mpesaApiBase() {
            return (typeof MPESA_URL === 'string' ? MPESA_URL : '').replace(/\/$/, '');
        },
        whatsappApiBase() {
            const base = this.mpesaApiBase();
            return base ? `${base}/api/whatsapp` : '';
        },
        whatsappLinkingStatuses() {
            return ['SCAN_QR_CODE', 'STARTING', 'STARTED', 'OPENING', 'PAIRING', 'CONNECTING'];
        },
        shouldPollWhatsAppLinking(status = this.whatsappStatus?.status) {
            if (this.whatsappLinked) return false;
            if (this.whatsappLinkingRequested) return true;
            return this.whatsappLinkingStatuses.includes(status);
        },
        qrImageSrc(qr) {
            if (!qr) return '';
            if (typeof qr === 'string') {
                return qr.startsWith('data:') ? qr : `data:image/png;base64,${qr}`;
            }
            if (typeof qr === 'object') {
                const data = qr.data || qr.base64 || qr.image || qr.qr;
                if (!data) return '';
                const mime = qr.mimetype || qr.mimeType || 'image/png';
                return String(data).startsWith('data:') ? data : `data:${mime};base64,${data}`;
            }
            return '';
        },
        applyWhatsAppStatus(data) {
            const wasLinked = this.whatsappLinked;
            this.whatsappStatus = data || null;

            if (data?.linked) {
                this.whatsappQr = null;
                this.whatsappLinkingRequested = false;
                this.stopWhatsAppPolling();
                if (!wasLinked && this.whatsappDialogOpen) {
                    this.$toast({
                        title: 'WhatsApp linked',
                        description: 'WhatsApp is connected and will be used for notifications.',
                    });
                }
                return;
            }

            if (data?.qr) {
                this.whatsappQr = data.qr;
            } else if (data?.status !== 'SCAN_QR_CODE') {
                this.whatsappQr = null;
            }

            if (this.shouldPollWhatsAppLinking(data?.status)) {
                this.startWhatsAppPolling();
            } else {
                this.whatsappLinkingRequested = false;
                this.stopWhatsAppPolling();
            }
        },
        startWhatsAppPolling() {
            if (this.whatsappPollTimer) return;
            this.whatsappPollTimer = setInterval(() => {
                this.pollWhatsAppLinking();
            }, 2000);
        },
        stopWhatsAppPolling() {
            if (!this.whatsappPollTimer) return;
            clearInterval(this.whatsappPollTimer);
            this.whatsappPollTimer = null;
        },
        async pollWhatsAppLinking() {
            await this.refreshWhatsAppStatus({ silent: true });
            if (this.whatsappLinked) return;
            if (this.whatsappStatus?.status === 'SCAN_QR_CODE') {
                await this.refreshWhatsAppQr({ silent: true });
            }
        },
        async refreshWhatsAppStatus({ silent = false } = {}) {
            const base = this.whatsappApiBase();
            if (!base) {
                this.whatsappError = 'MPESA_URL is not configured';
                this.whatsappLoading = false;
                return;
            }

            if (!silent) {
                this.whatsappLoading = true;
                this.whatsappError = '';
            }

            try {
                const data = await $fetch(`${base}/status`, { method: 'GET' });
                this.applyWhatsAppStatus(data);
                this.whatsappError = '';
            } catch (e) {
                console.error('WhatsApp status failed', base, e);
                if (!silent) {
                    this.whatsappError = 'Unable to load WhatsApp status';
                }
            } finally {
                if (!silent) {
                    this.whatsappLoading = false;
                }
            }
        },
        async startWhatsAppLink() {
            const base = this.whatsappApiBase();
            if (!base) {
                this.$toast({
                    title: 'Configuration error',
                    description: 'MPESA_URL is not configured',
                    variant: 'destructive',
                });
                return;
            }

            this.whatsappActionLoading = true;
            this.whatsappLinkingRequested = true;
            this.whatsappError = '';
            try {
                const data = await $fetch(`${base}/link`, { method: 'POST' });
                this.applyWhatsAppStatus(data);
                if (data?.status === 'SCAN_QR_CODE' && !data?.qr) {
                    await this.refreshWhatsAppQr({ silent: true });
                }
                this.$toast({
                    title: data?.linked ? 'WhatsApp linked' : 'Linking started',
                    description: data?.linked
                        ? 'WhatsApp is connected and will be used for notifications.'
                        : 'Scan the QR code with WhatsApp to finish linking.',
                });
            } catch (e) {
                console.error('WhatsApp link failed', e);
                this.whatsappLinkingRequested = false;
                this.stopWhatsAppPolling();
                this.$toast({
                    title: 'Unable to link WhatsApp',
                    description: 'There was a problem starting WhatsApp linking.',
                    variant: 'destructive',
                });
            } finally {
                this.whatsappActionLoading = false;
            }
        },
        async refreshWhatsAppQr({ silent = false } = {}) {
            const base = this.whatsappApiBase();
            if (!base) return;

            if (!silent) {
                this.whatsappActionLoading = true;
            }

            try {
                const data = await $fetch(`${base}/qr`, { method: 'GET' });
                this.applyWhatsAppStatus(data);
                if (data?.linked) {
                    this.$toast({
                        title: 'WhatsApp linked',
                        description: 'WhatsApp is connected and will be used for notifications.',
                    });
                }
            } catch (e) {
                console.error('WhatsApp QR failed', e);
                if (!silent) {
                    this.$toast({
                        title: 'Unable to load QR code',
                        description: 'There was a problem fetching the WhatsApp QR code.',
                        variant: 'destructive',
                    });
                }
            } finally {
                if (!silent) {
                    this.whatsappActionLoading = false;
                }
            }
        },
        async unlinkWhatsApp() {
            const base = this.whatsappApiBase();
            if (!base) return;

            this.whatsappActionLoading = true;
            this.whatsappLinkingRequested = false;
            this.stopWhatsAppPolling();
            try {
                const data = await $fetch(`${base}/unlink`, { method: 'POST' });
                this.applyWhatsAppStatus(data);
                this.whatsappLinkingRequested = false;
                this.stopWhatsAppPolling();
                this.whatsappError = '';
                this.$toast({
                    title: 'WhatsApp unlinked',
                    description: 'Notifications will fall back to SMS.',
                });
            } catch (e) {
                console.error('WhatsApp unlink failed', e);
                await this.refreshWhatsAppStatus({ silent: true });
                this.whatsappLinkingRequested = false;
                this.stopWhatsAppPolling();
                if (!this.whatsappLinked) {
                    this.whatsappError = '';
                    this.$toast({
                        title: 'WhatsApp unlinked',
                        description: 'Notifications will fall back to SMS.',
                    });
                    return;
                }
                this.$toast({
                    title: 'Unable to unlink WhatsApp',
                    description: 'There was a problem unlinking WhatsApp.',
                    variant: 'destructive',
                });
            } finally {
                this.whatsappActionLoading = false;
            }
        },
        async sendWhatsAppTestMessage() {
            const base = this.whatsappApiBase();
            const phoneNumber = this.whatsappTestPhone.trim();
            const message = this.whatsappTestMessage.trim();

            if (!base) {
                this.$toast({
                    title: 'Configuration error',
                    description: 'MPESA_URL is not configured',
                    variant: 'destructive',
                });
                return;
            }

            if (!phoneNumber) {
                this.$toast({
                    title: 'Phone number required',
                    description: 'Enter a phone number to send the test message.',
                    variant: 'destructive',
                });
                return;
            }

            this.whatsappTestLoading = true;
            try {
                const data = await $fetch(`${base}/message`, {
                    method: 'POST',
                    body: {
                        phoneNumber,
                        message,
                    },
                });
                this.$toast({
                    title: 'Test message sent',
                    description: data?.devMode
                        ? 'Dev mode: message was not sent to WhatsApp.'
                        : `Sent via WhatsApp${data?.messageId ? ` (${data.messageId})` : ''}.`,
                });
            } catch (e) {
                console.error('WhatsApp test message failed', e);
                const description = e?.data?.error
                    || e?.data?.details
                    || 'There was a problem sending the test message.';
                this.$toast({
                    title: 'Unable to send test message',
                    description: typeof description === 'string' ? description : 'There was a problem sending the test message.',
                    variant: 'destructive',
                });
            } finally {
                this.whatsappTestLoading = false;
            }
        },
        /**
         * GET `/status` — Onfon balance at `checks.sms_balance`; AWS limit at `checks.sms_monthly_spend_limit`.
         */
        parseSmsCreditFromStatusResponse(data) {
            if (!data || typeof data !== 'object') return null;
            const checks = data.checks;
            if (!checks || typeof checks !== 'object') return null;

            const provider = String(checks.sms_provider ?? checks.smsProvider ?? '').trim().toLowerCase();
            const isAws = provider === 'aws'
                || (checks.sms_monthly_spend_limit ?? checks.smsMonthlySpendLimit) != null;

            if (isAws) {
                const raw = checks.sms_monthly_spend_limit ?? checks.smsMonthlySpendLimit;
                if (raw == null || raw === '') return null;
                const amount = Number(raw);
                const value = Number.isNaN(amount) ? String(raw) : `$${amount.toFixed(2)}`;
                return {
                    label: 'AWS monthly limit',
                    value,
                };
            }

            const raw = checks.sms_balance ?? checks.smsBalance;
            if (raw == null || raw === '') return null;
            const balance = Number(raw);
            return {
                label: 'SMS Balance',
                value: Number.isNaN(balance) ? String(raw) : balance,
            };
        },
        async getSMSBalance(){
            this.smsCreditLabel = 'SMS Balance';
            this.smsCreditValue = null;
            this.smsCreditMessage = '';
            const base = this.mpesaApiBase();
            if (!base) {
                this.smsCreditMessage = 'MPESA_URL is not configured';
                return;
            }

            try {
                const data = await $fetch(`${base}/status`, { method: 'GET' });
                const credit = this.parseSmsCreditFromStatusResponse(data);
                if (credit) {
                    this.smsCreditLabel = credit.label;
                    this.smsCreditValue = credit.value;
                    return;
                }
                this.smsCreditMessage = 'Unable to load SMS credit info';
            } catch (e) {
                this.smsCreditMessage = 'Unable to load SMS credit info';
                console.error('SMS credit: GET /status failed', base, e);
            }
        },
        debouncedSearch: debounce(async function(){
            this.page = 1
            this.getAllTransactions()
        }),
        resend: debounce(async function (id){
            try{
                const response = await $fetch(`${MPESA_URL}/api/admin/resend-sms`,{
                    params : {
                        id : id
                    }
                })
                this.activeDialogRequestId = null;
                this.$toast({
                    title: 'Success',
                    description: 'SMS sent successfully',
                });
                this.getSMSBalance();

            }catch(e){
                console.log(e);
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }
        }, 500),
        formatedDate(dateString){
            return new Date(dateString).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        getRequestMessage(request){
            return (request?.Message || 'No message available').replace(/\n/g, '<br>');
        },
        getRequestTokens(request){
            const relatedTransaction = request?.relatedTransaction || request?.RelatedTransaction;
            const jsonData = relatedTransaction?.JsonData || relatedTransaction?.jsonData;
            const tokenTxns = jsonData?.ListOfTokenTransactions || jsonData?.listOfTokenTransactions || [];

            const tokenNumbers = tokenTxns.flatMap((txn) => {
                const tokens = txn?.Tokens || txn?.tokens || [];
                return tokens
                    .map((token) => token?.DelimitedTokenNumber || token?.delimitedTokenNumber)
                    .filter(Boolean);
            });

            if (tokenNumbers.length > 0) {
                return tokenNumbers.join(', ');
            }

            return '';
        },
        formattedTime(dateString){
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        },
        changePage(page){
            if (page < 1) return
            if (this.totalPages > 0 && page > this.totalPages) return
            this.page = page
        },
        async getAllTransactions(){
            this.isLoading = true
            try {
                const response = await $fetch(`${MPESA_URL}/api/admin/transactions`, {
                    params: {
                        page: this.page,
                        limit: this.pageSize,
                        fromDate: this.formatDate(this.dateRange.start),
                        toDate: this.formatDate(this.dateRange.end),
                        search: this.search
                    }
                })
                this.page = response.pagination.currentPage
                this.hasNextPage = response.pagination.hasNextPage
                this.pageSize = response.pagination.limit
                this.totalPages = response.pagination.totalPages
                this.requests = response.transactions || []
            } catch (e) {
                console.error('getAllTransactions', e)
                this.requests = []
                this.totalPages = 0
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted(){
        this.getSMSBalance();
        this.refreshWhatsAppStatus();
        this.getAllTransactions();
    },
    beforeUnmount() {
        this.stopWhatsAppPolling();
    },
    watch:{
        dateRange:{
            handler(newVal, oldVal){
                // Deep watch: new/old are often the same object reference; compare serialised range.
                if (oldVal === undefined) return;
                if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
                this.page = 1;
                this.getAllTransactions();
            },
            deep: true
        },
        page(newVal, oldVal){
            if (oldVal === undefined) return;
            if (newVal === oldVal) return;
            this.getAllTransactions();
        },
        pageSize(newVal, oldVal){
            if (oldVal === undefined) return;
            if (newVal === oldVal) return;
            this.page = 1;
            this.getAllTransactions();
        }
        // search: handled by debouncedSearch on input (avoids duplicate fetches vs v-model watcher)
    }
}
</script>
<style scoped>
.mpesa-request-card{
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    cursor: pointer;
}
.dialog-mpesa-request-grid{
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
}

.dialog-mpesa-request-grid p {
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
</style>