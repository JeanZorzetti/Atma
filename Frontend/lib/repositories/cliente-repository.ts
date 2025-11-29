/**
 * Repositório de Clientes
 * Fase 5.1: CRM Integration
 */

import { query, queryOne, insert } from '../db'

export interface Cliente {
  id?: number
  nome: string
  email: string
  idade?: number
  cidade?: string
  estado?: string
  telefone?: string
  profissao?: string
  created_at?: Date
  updated_at?: Date
}

/**
 * Busca cliente por email
 */
export async function buscarClientePorEmail(email: string): Promise<Cliente | null> {
  return queryOne<Cliente>(
    'SELECT * FROM clientes WHERE email = ? LIMIT 1',
    [email]
  )
}

/**
 * Busca cliente por ID
 */
export async function buscarClientePorId(id: number): Promise<Cliente | null> {
  return queryOne<Cliente>(
    'SELECT * FROM clientes WHERE id = ? LIMIT 1',
    [id]
  )
}

/**
 * Cria ou atualiza cliente
 * IMPORTANTE: Todos os valores são sanitizados para evitar undefined
 */
export async function salvarCliente(cliente: Cliente): Promise<number> {
  const logId = `cliente-${Date.now()}`

  console.log(`[${logId}] ========== SAVING CLIENTE ==========`)
  console.log(`[${logId}] Input:`, {
    nome: cliente.nome,
    email: cliente.email,
    idade: cliente.idade,
    cidade: cliente.cidade,
    estado: cliente.estado,
    telefone: cliente.telefone,
    profissao: cliente.profissao
  })

  // Sanitizar TODOS os valores - converter undefined para null
  const nome = cliente.nome ?? null
  const email = cliente.email ?? null
  const idade = cliente.idade !== undefined ? cliente.idade : null
  const cidade = cliente.cidade ?? null
  const estado = cliente.estado ?? null
  const telefone = cliente.telefone ?? null
  const profissao = cliente.profissao ?? null

  console.log(`[${logId}] Sanitized values:`, { nome, email, idade, cidade, estado, telefone, profissao })

  try {
    const clienteExistente = await buscarClientePorEmail(cliente.email)

    if (clienteExistente) {
      console.log(`[${logId}] Cliente exists, updating ID: ${clienteExistente.id}`)
      // Atualizar cliente existente
      await query(
        `UPDATE clientes
         SET nome = ?, idade = ?, cidade = ?, estado = ?, telefone = ?, profissao = ?
         WHERE email = ?`,
        [nome, idade, cidade, estado, telefone, profissao, email]
      )
      console.log(`[${logId}] ✅ Cliente updated successfully`)
      return clienteExistente.id!
    } else {
      console.log(`[${logId}] Creating new cliente`)
      // Criar novo cliente
      const result = await insert(
        `INSERT INTO clientes (nome, email, idade, cidade, estado, telefone, profissao)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nome, email, idade, cidade, estado, telefone, profissao]
      )
      console.log(`[${logId}] ✅ Cliente created successfully, ID: ${result}`)
      return result
    }
  } catch (error: any) {
    console.error(`[${logId}] ❌ CLIENTE SAVE FAILED`)
    console.error(`[${logId}] Error:`, error?.message)
    console.error(`[${logId}] SQL Error:`, error?.sqlMessage)
    throw error
  }
}

/**
 * Lista todos os clientes (com paginação)
 */
export async function listarClientes(limit = 50, offset = 0): Promise<Cliente[]> {
  return query<Cliente>(
    'SELECT * FROM clientes ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  )
}

/**
 * Conta total de clientes
 */
export async function contarClientes(): Promise<number> {
  const result = await queryOne<{ total: number }>(
    'SELECT COUNT(*) as total FROM clientes'
  )
  return result?.total || 0
}

/**
 * Busca clientes por nome ou email (pesquisa)
 */
export async function pesquisarClientes(termo: string, limit = 20): Promise<Cliente[]> {
  return query<Cliente>(
    `SELECT * FROM clientes
     WHERE nome LIKE ? OR email LIKE ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [`%${termo}%`, `%${termo}%`, limit]
  )
}
