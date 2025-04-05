// server/api/wallet/load-card.post.ts
import { prisma } from '~/server/db'
import { H3Event, sendError } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const user = await getUserFromEvent(event) // You must implement or adapt this
    const { card_number, pin } = body

    if (!card_number || !pin) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing card_number or pin' }))
    }

    const card = await prisma.card.findUnique({
      where: { number: card_number }
    })

    if (!card || card.pin !== pin) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid card or PIN' }))
    }

    if (card.used) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Card already used' }))
    }

    await prisma.$transaction(async (tx) => {
      // Credit wallet
      await tx.wallet.update({
        where: { user_id: user.id },
        data: { balance: { increment: card.amount } }
      })

      // Mark card as used
      await tx.card.update({
        where: { id: card.id },
        data: {
          used: true,
          used_at: new Date(),
          used_by_user_id: user.id
        }
      })

      // Log transaction
      await tx.walletTransaction.create({
        data: {
          user_id: user.id,
          type: 'credit',
          amount: card.amount,
          reference: `Card Load: ${card.number}`
        }
      })
    })

    const updatedWallet = await prisma.wallet.findUnique({
      where: { user_id: user.id }
    })

    return {
      success: true,
      message: 'Card loaded successfully',
      wallet_balance: updatedWallet?.balance
    }

  } catch (error: any) {
    console.error(error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error' }))
  }
})
