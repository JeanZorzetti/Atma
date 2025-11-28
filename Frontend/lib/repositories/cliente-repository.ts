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
 */
export async function salvarCliente(cliente: Cliente): Promise<number> {
  const clienteExistente = await buscarClientePorEmail(cliente.email)

  if (clienteExistente) {
    // Atualizar cliente existente
    await query(
      `UPDATE clientes
       SET nome = ?, idade = ?, cidade = ?, estado = ?, telefone = ?, profissao = ?
       WHERE email = ?`,
      [
        cliente.nome,
        cliente.idade,
        cliente.cidade,
        cliente.estado,
        cliente.telefone,
        cliente.profissao,
        cliente.email
      ]
    )
    return clienteExistente.id!
  } else {
    // Criar novo cliente
    return insert(
      `INSERT INTO clientes (nome, email, idade, cidade, estado, telefone, profissao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente.nome,
        cliente.email,
        cliente.idade,
        cliente.cidade,
        cliente.estado,
        cliente.telefone,
        cliente.profissao
      ]
    )
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
