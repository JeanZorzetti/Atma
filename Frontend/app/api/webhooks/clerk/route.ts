/**
 * Webhook do Clerk para sincronizar usuários
 *
 * Eventos suportados:
 * - user.created: Criar novo usuário no banco
 * - user.updated: Atualizar dados do usuário
 * - user.deleted: Deletar usuário do banco
 *
 * Documentação: https://clerk.com/docs/integrations/webhooks
 */

import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { query, insert } from '@/lib/db'
import { NextResponse } from 'next/server'

// Tipo do payload de usuário do Clerk
type ClerkUser = {
  id: string
  email_addresses: Array<{ email_address: string }>
  first_name: string | null
  last_name: string | null
  phone_numbers?: Array<{ phone_number: string }>
  image_url?: string
  created_at: number
  updated_at: number
}

export async function POST(req: Request) {
  // Pegar o webhook secret do ambiente
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET não configurado')
    return new NextResponse('Webhook secret não configurado', { status: 500 })
  }

  // Pegar os headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // Validar que todos os headers existem
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Headers do webhook ausentes')
    return new NextResponse('Headers do webhook ausentes', { status: 400 })
  }

  // Pegar o body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Criar uma nova instância do Svix com o secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verificar o payload com os headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Erro ao verificar webhook:', err)
    return new NextResponse('Erro ao verificar webhook', { status: 400 })
  }

  // Processar o evento
  const eventType = evt.type
  console.log(`📨 Webhook recebido: ${eventType}`)

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data as ClerkUser)
        break

      case 'user.updated':
        await handleUserUpdated(evt.data as ClerkUser)
        break

      case 'user.deleted':
        await handleUserDeleted(evt.data as { id: string })
        break

      default:
        console.log(`⚠️ Evento não tratado: ${eventType}`)
    }

    return new NextResponse('Webhook processado com sucesso', { status: 200 })
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    return new NextResponse('Erro ao processar webhook', { status: 500 })
  }
}

/**
 * Criar novo usuário no banco
 */
async function handleUserCreated(user: ClerkUser) {
  console.log('👤 Criando usuário:', user.id)

  const email = user.email_addresses[0]?.email_address || ''
  const nome = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Usuário'
  const telefone = user.phone_numbers?.[0]?.phone_number || null
  const fotoUrl = user.image_url || null

  try {
    // Verificar se usuário já existe
    const existingUser = await query<{ id: number }>(
      'SELECT id FROM portal_users WHERE clerk_user_id = ?',
      [user.id]
    )

    if (existingUser.length > 0) {
      console.log('⚠️ Usuário já existe no banco:', user.id)
      return
    }

    // Inserir usuário
    const userId = await insert(
      `INSERT INTO portal_users
        (clerk_user_id, email, nome, telefone, foto_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [user.id, email, nome, telefone, fotoUrl]
    )

    console.log('✅ Usuário criado no banco:', userId)

    // Criar preferências padrão
    await insert(
      `INSERT INTO portal_preferencias
        (user_id, created_at, updated_at)
       VALUES (?, NOW(), NOW())`,
      [userId]
    )

    console.log('✅ Preferências criadas para usuário:', userId)
  } catch (error) {
    console.error('❌ Erro ao criar usuário no banco:', error)
    throw error
  }
}

/**
 * Atualizar dados do usuário
 */
async function handleUserUpdated(user: ClerkUser) {
  console.log('👤 Atualizando usuário:', user.id)

  const email = user.email_addresses[0]?.email_address || ''
  const nome = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Usuário'
  const telefone = user.phone_numbers?.[0]?.phone_number || null
  const fotoUrl = user.image_url || null

  try {
    await query(
      `UPDATE portal_users
       SET email = ?, nome = ?, telefone = ?, foto_url = ?, updated_at = NOW()
       WHERE clerk_user_id = ?`,
      [email, nome, telefone, fotoUrl, user.id]
    )

    console.log('✅ Usuário atualizado no banco:', user.id)
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário no banco:', error)
    throw error
  }
}

/**
 * Deletar usuário do banco
 */
async function handleUserDeleted(data: { id: string }) {
  console.log('👤 Deletando usuário:', data.id)

  try {
    // O CASCADE vai deletar automaticamente:
    // - portal_relatorios
    // - portal_acessos
    // - portal_interacoes
    // - portal_preferencias
    await query('DELETE FROM portal_users WHERE clerk_user_id = ?', [data.id])

    console.log('✅ Usuário deletado do banco:', data.id)
  } catch (error) {
    console.error('❌ Erro ao deletar usuário do banco:', error)
    throw error
  }
}
