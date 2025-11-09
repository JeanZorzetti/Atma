# Padronização de Status de Pacientes B2C (patient_leads)

## Data: 2025-11-09
## Contexto: Análise de discrepâncias entre Frontend e Database

---

## 🔍 Análise das Fontes de Status

### 1️⃣ **Database Schema** (`patient_leads` table)
**Arquivo:** `Backend/database/schema.sql` (linha 12)

```sql
status ENUM('novo', 'contatado', 'agendado', 'convertido', 'cancelado', 'excluido') DEFAULT 'novo'
```

**Status disponíveis no banco:**
1. `novo` - Lead inicial
2. `contatado` - Lead foi contactado
3. `agendado` - Consulta agendada
4. `convertido` - Virou paciente/cliente
5. `cancelado` - Lead cancelado
6. `excluido` - Lead excluído do sistema

**Total:** 6 status

---

### 2️⃣ **Frontend - Modal de Edição** (`admin/pacientes/lista/page.tsx`)
**Arquivo:** `admin/src/app/admin/pacientes/lista/page.tsx` (linhas 643-648)

```tsx
<SelectContent>
  <SelectItem value="novo">Novo</SelectItem>
  <SelectItem value="contatado">Contatado</SelectItem>
  <SelectItem value="agendado">Agendado</SelectItem>
  <SelectItem value="atribuido">Em Andamento</SelectItem>
  <SelectItem value="convertido">Convertido</SelectItem>
  <SelectItem value="cancelado">Cancelado</SelectItem>
</SelectContent>
```

**Status disponíveis no modal:**
1. `novo` - Novo ✅
2. `contatado` - Contatado ✅
3. `agendado` - Agendado ✅
4. `atribuido` - Em Andamento ❌ **NÃO EXISTE NO BANCO**
5. `convertido` - Convertido ✅
6. `cancelado` - Cancelado ✅

**Total:** 6 status (mas 1 inválido)

---

### 3️⃣ **Frontend - Filtro de Status** (`admin/pacientes/lista/page.tsx`)
**Arquivo:** `admin/src/app/admin/pacientes/lista/page.tsx` (linhas 390-395)

```tsx
<SelectContent>
  <SelectItem value="all">Todos os status</SelectItem>
  <SelectItem value="novo">Novo</SelectItem>
  <SelectItem value="contatado">Contatado</SelectItem>
  <SelectItem value="agendado">Agendado</SelectItem>
  <SelectItem value="atribuido">Em Andamento</SelectItem>
  <SelectItem value="convertido">Convertido</SelectItem>
  <SelectItem value="cancelado">Cancelado</SelectItem>
</SelectContent>
```

**Mesmos status do modal de edição** (mesmo problema)

---

### 4️⃣ **Frontend - Badges de Status** (`admin/pacientes/lista/page.tsx`)
**Arquivo:** `admin/src/app/admin/pacientes/lista/page.tsx` (linhas 293-309)

```tsx
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'novo':
      return <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
    case 'contatado':
      return <Badge className="bg-yellow-100 text-yellow-800">Contatado</Badge>
    case 'agendado':
      return <Badge className="bg-purple-100 text-purple-800">Agendado</Badge>
    case 'atribuido':
      return <Badge className="bg-green-100 text-green-800">Em Andamento</Badge>
    case 'convertido':
      return <Badge className="bg-emerald-100 text-emerald-800">Convertido</Badge>
    case 'cancelado':
      return <Badge className="bg-orange-100 text-orange-800">Cancelado</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
```

**Status suportados:**
1. `novo` ✅
2. `contatado` ✅
3. `agendado` ✅
4. `atribuido` ❌ **NÃO EXISTE NO BANCO**
5. `convertido` ✅
6. `cancelado` ✅

**Falta:** `excluido` (existe no banco, mas não tem badge)

---

### 5️⃣ **Frontend - Kanban Board** (`admin/pacientes/kanban/page.tsx`)
**Arquivo:** `admin/src/app/admin/pacientes/kanban/page.tsx` (linhas 48-56)

```tsx
const STATUS_COLORS = {
  'novo': 'bg-blue-100 text-blue-800 border-blue-200',
  'contatado': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'agendado': 'bg-purple-100 text-purple-800 border-purple-200',
  'avaliacao_inicial': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'atribuido': 'bg-orange-100 text-orange-800 border-orange-200', // Em tratamento
  'convertido': 'bg-green-100 text-green-800 border-green-200',
  'cancelado': 'bg-gray-100 text-gray-800 border-gray-200'
}
```

**Colunas do Kanban** (linhas 60-100):
1. `novo` - Novos ✅
2. `contatado` - Contatados ✅
3. `agendado` - Agendados ✅
4. `avaliacao_inicial` - Avaliação Inicial ❌ **NÃO EXISTE NO BANCO**
5. `atribuido` - Em Tratamento ❌ **NÃO EXISTE NO BANCO**
6. `convertido` - Concluídos ✅

**Total:** 6 colunas (2 inválidas)

**Observação:** Linha 84 mostra:
```tsx
count: 0, // Placeholder - adicionar quando tiver campo específico
patients: []
```
Isso indica que o desenvolvedor sabia que `avaliacao_inicial` ainda não existia.

---

### 6️⃣ **Frontend - Labels de Status no Kanban** (`admin/pacientes/kanban/page.tsx`)
**Arquivo:** `admin/src/app/admin/pacientes/kanban/page.tsx` (linhas 181-192)

```tsx
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'novo': 'Novos',
    'contatado': 'Contatados',
    'agendado': 'Agendados',
    'avaliacao_inicial': 'Avaliação Inicial',
    'atribuido': 'Em Tratamento',
    'convertido': 'Concluídos',
    'cancelado': 'Cancelados'
  }
  return labels[status] || status
}
```

**Mesmos status das colunas do Kanban**

---

## ❌ Discrepâncias Identificadas

### Problema 1: Status `atribuido` não existe no banco
**Onde aparece:**
- ✅ Modal de edição (`lista/page.tsx`)
- ✅ Filtro de status (`lista/page.tsx`)
- ✅ Badges de status (`lista/page.tsx`)
- ✅ Kanban colors (`kanban/page.tsx`)
- ✅ Kanban columns (`kanban/page.tsx`)
- ✅ Kanban labels (`kanban/page.tsx`)

**Onde deveria estar:**
- ❌ Database `patient_leads.status` ENUM

**Impacto:**
- Se um usuário tentar mover um card para "Em Tratamento" no Kanban, o backend vai recusar (ENUM inválido)
- Se tentar editar e salvar com status `atribuido`, vai dar erro no banco

---

### Problema 2: Status `avaliacao_inicial` não existe no banco
**Onde aparece:**
- ✅ Kanban colors (`kanban/page.tsx`)
- ✅ Kanban columns (`kanban/page.tsx`)
- ✅ Kanban labels (`kanban/page.tsx`)

**Onde deveria estar:**
- ❌ Database `patient_leads.status` ENUM

**Impacto:**
- Coluna "Avaliação Inicial" sempre vazia (hard-coded como placeholder)
- Se tentarem mover card para essa coluna, vai dar erro

---

### Problema 3: Status `excluido` existe no banco mas não tem representação visual
**Onde existe:**
- ✅ Database `patient_leads.status` ENUM

**Onde NÃO aparece:**
- ❌ Modal de edição
- ❌ Filtro de status
- ❌ Badges de status (vai usar default)
- ❌ Kanban (não tem coluna)

**Impacto:**
- Se um lead tiver status `excluido`, ele vai aparecer com badge genérico
- Não há como filtrar por "excluídos"
- Não há como mover card para "excluído" no Kanban
- Provavelmente esses leads deveriam estar ocultos ou numa view separada

---

## 📋 Matriz de Compatibilidade

| Status | Database | Modal Edição | Filtro | Badges | Kanban Cores | Kanban Colunas | Kanban Labels |
|--------|----------|--------------|--------|--------|--------------|----------------|---------------|
| `novo` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `contatado` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `agendado` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `convertido` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `cancelado` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `excluido` | ✅ | ❌ | ❌ | ❌ (default) | ❌ | ❌ | ❌ |
| `atribuido` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `avaliacao_inicial` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

**Legenda:**
- ✅ = Implementado corretamente
- ❌ = Faltando ou incompatível
- ❌ (default) = Usa fallback/default

---

## 🎯 Proposta de Padronização

### Opção A: Adicionar status ausentes ao banco (RECOMENDADO)

**Adicionar ao ENUM:**
- `atribuido` - Paciente atribuído a um ortodontista (em andamento)
- `avaliacao_inicial` - Paciente em avaliação inicial (antes de iniciar tratamento)

**Remover do ENUM:**
- `excluido` - Usar soft delete (campo `deleted_at`) ou fazer hard delete

**Novo ENUM proposto:**
```sql
status ENUM(
  'novo',              -- Lead inicial (cadastro)
  'contatado',         -- Lead foi contactado
  'agendado',          -- Consulta agendada
  'avaliacao_inicial', -- Em avaliação inicial
  'atribuido',         -- Atribuído a ortodontista (em tratamento)
  'convertido',        -- Tratamento concluído/convertido
  'cancelado'          -- Lead cancelado
) DEFAULT 'novo'
```

**Funil de conversão:**
```
novo → contatado → agendado → avaliacao_inicial → atribuido → convertido
                                                       ↓
                                                  cancelado (saída)
```

**Vantagens:**
- ✅ Funil completo de 7 estágios
- ✅ Separação clara entre "avaliação" e "tratamento"
- ✅ Todas as interfaces ficam compatíveis
- ✅ Melhor rastreamento de conversão

**Migration necessária:**
```sql
-- Migration: Add atribuido and avaliacao_inicial to patient_leads status
ALTER TABLE patient_leads
MODIFY COLUMN status ENUM(
  'novo',
  'contatado',
  'agendado',
  'avaliacao_inicial',
  'atribuido',
  'convertido',
  'cancelado',
  'excluido'  -- manter temporariamente
) DEFAULT 'novo';

-- Mover todos os excluídos para cancelado ou fazer soft delete
UPDATE patient_leads SET status = 'cancelado' WHERE status = 'excluido';

-- Remover 'excluido' do ENUM
ALTER TABLE patient_leads
MODIFY COLUMN status ENUM(
  'novo',
  'contatado',
  'agendado',
  'avaliacao_inicial',
  'atribuido',
  'convertido',
  'cancelado'
) DEFAULT 'novo';
```

---

### Opção B: Remover status inválidos do frontend

**Remover do frontend:**
- `atribuido` (todas as referências)
- `avaliacao_inicial` (todas as referências)

**Adicionar ao frontend:**
- `excluido` (badge, filtro, coluna Kanban)

**Vantagens:**
- ✅ Menos mudanças no banco
- ✅ Rápido de implementar

**Desvantagens:**
- ❌ Perde granularidade no funil
- ❌ Usuários já podem estar usando "Em Andamento" mentalmente
- ❌ Funil menos detalhado (5 estágios vs 7)

---

## 🔧 Recomendação Final

**Escolher Opção A** por estes motivos:

1. **Funil mais completo**: 7 estágios permitem rastreamento detalhado
2. **Interfaces já construídas**: Kanban e formulários já têm UI para esses status
3. **Expectativa do usuário**: Desenvolvedor criou esses status com intenção
4. **BI de Conversão**: Mais dados = mais insights sobre gargalos

---

## 📝 Checklist de Implementação (Opção A)

### Backend:
- [ ] Criar migration `010_add_patient_status_atribuido_avaliacao.sql`
- [ ] Adicionar `atribuido` e `avaliacao_inicial` ao ENUM
- [ ] Migrar dados `excluido` para `cancelado` ou soft delete
- [ ] Remover `excluido` do ENUM (após migração)
- [ ] Testar migration em staging

### Frontend - Lista de Pacientes:
- [ ] Adicionar badge para `avaliacao_inicial` (cor: indigo)
- [ ] Verificar se `atribuido` já funciona (já tem badge)
- [ ] Remover opções de `excluido` (ou adicionar se quiserem manter)

### Frontend - Kanban:
- [ ] Verificar se drag & drop funciona para `avaliacao_inicial`
- [ ] Verificar se drag & drop funciona para `atribuido`
- [ ] Adicionar coluna `cancelado` se necessário

### Backend - BI de Conversão:
- [ ] Atualizar `conversionFunnelService.js` para incluir:
  - `avaliacao_inicial` na contagem
  - `atribuido` na contagem
  - Taxas de conversão entre cada estágio

### Testes:
- [ ] Criar lead com cada status
- [ ] Mover cards entre todas as colunas do Kanban
- [ ] Editar status no modal
- [ ] Filtrar por cada status
- [ ] Validar BI mostra todos os estágios

---

## 🚨 Avisos Importantes

1. **Backup antes da migration**: `mysqldump atma_aligner > backup_$(date +%Y%m%d).sql`
2. **Testar em staging primeiro**
3. **Avisar usuários sobre novos status**
4. **Documentar significado de cada status para time comercial**
5. **Considerar adicionar tooltip/help text nas interfaces**

---

## 📊 Impacto Esperado

### No BI de Conversão:
Atualmente:
```
SEO → Cadastro → Agendamento → Comparecimento
```

Após padronização:
```
SEO → Cadastro (novo) → Contatado → Agendado → Avaliação Inicial → Em Tratamento (atribuido) → Convertido
                                                                            ↓
                                                                       Cancelado
```

**Métricas novas disponíveis:**
- Taxa de resposta ao contato (novo → contatado)
- Taxa de agendamento (contatado → agendado)
- Taxa de comparecimento (agendado → avaliacao_inicial)
- Taxa de início de tratamento (avaliacao_inicial → atribuido)
- Taxa de conclusão (atribuido → convertido)
- Taxa de cancelamento em cada etapa

---

**Documento criado em:** 2025-11-09
**Autor:** Claude Code (Análise Automatizada)
**Status:** Aguardando aprovação para implementação
