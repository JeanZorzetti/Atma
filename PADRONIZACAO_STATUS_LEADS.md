# Padronização de Status de Leads CRM

## 🔍 Problema Identificado

Há discrepância entre os status definidos no banco de dados e os status utilizados nas interfaces:

### Status no Banco de Dados (patients_leads)
```sql
status ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao')
```

### Status nas Interfaces

**Kanban (admin/crm/kanban/page.tsx):**
- ✅ `prospeccao`
- ✅ `contato_inicial`
- ✅ `apresentacao`
- ✅ `negociacao`
- ❌ `parceria_fechada` (NÃO EXISTE NO BANCO)

**Dropdown de Status (admin/crm/leads/page.tsx):**
- ✅ `prospeccao`
- ✅ `contato_inicial`
- ✅ `apresentacao`
- ✅ `negociacao`
- ❌ Falta `parceria_fechada`

## ✅ Solução Proposta

Adicionar o status `parceria_fechada` ao banco de dados para completar o funil de vendas B2B.

### Funil Completo de Conversão B2B

1. **Prospecção** (`prospeccao`)
   - Lead identificado
   - Pesquisa inicial sobre o ortodontista
   - Qualificação preliminar

2. **Contato Inicial** (`contato_inicial`)
   - Primeiro contato feito (ligação, email, WhatsApp)
   - Lead respondeu e demonstrou interesse
   - Agendamento de reunião inicial

3. **Apresentação** (`apresentacao`)
   - Apresentação do Atma Aligner realizada
   - Demonstração de produto/tecnologia
   - Envio de proposta comercial

4. **Negociação** (`negociacao`)
   - Discussão de valores e condições
   - Ajustes na proposta
   - Tratamento de objeções
   - Análise de crédito/documentação

5. **Parceria Fechada** (`parceria_fechada`) ⭐ NOVO
   - Contrato assinado
   - Parceria confirmada
   - Lead vira ortodontista ativo
   - Início de onboarding

## 📊 Métricas de Conversão

Com os 5 status alinhados, podemos calcular:

```
Prospecção → Contato Inicial:    % de leads que respondem
Contato Inicial → Apresentação:  % que aceitam reunião
Apresentação → Negociação:       % que entram em negociação
Negociação → Parceria Fechada:   % de fechamento (taxa de conversão final)

Conversão Geral = Parceria Fechada / Total de Leads
```

## 🔧 Alterações Necessárias

### 1. Banco de Dados
```sql
-- Adicionar 'parceria_fechada' ao ENUM
ALTER TABLE patients_leads
MODIFY COLUMN status ENUM(
  'prospeccao',
  'contato_inicial',
  'apresentacao',
  'negociacao',
  'parceria_fechada'
) DEFAULT 'prospeccao';
```

### 2. Frontend - Dropdown de Status (leads/page.tsx)
Adicionar item no menu:
```tsx
<DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'parceria_fechada')}>
  Parceria Fechada
</DropdownMenuItem>
```

### 3. Frontend - Badge de Status (leads/page.tsx)
Adicionar cor:
```tsx
const badges = {
  'prospeccao': { label: 'Prospecção', color: 'bg-gray-100 text-gray-800' },
  'contato_inicial': { label: 'Contato', color: 'bg-blue-100 text-blue-800' },
  'apresentacao': { label: 'Apresentação', color: 'bg-yellow-100 text-yellow-800' },
  'negociacao': { label: 'Negociação', color: 'bg-orange-100 text-orange-800' },
  'parceria_fechada': { label: 'Parceria Fechada', color: 'bg-green-100 text-green-800' }
}
```

### 4. BI de Conversão - Atualizar Queries
O serviço `conversionFunnelService.js` precisa ser atualizado para incluir:
- Total de leads em cada estágio
- Taxa de conversão entre cada estágio
- Funil B2B completo (5 estágios)

## 🎯 Benefícios

1. **Consistência**: Todos os lugares usam os mesmos 5 status
2. **Rastreabilidade**: Podemos acompanhar cada lead do início ao fim
3. **Métricas precisas**: BI de conversão reflete a realidade
4. **Funil completo**: Visualização da jornada B2B inteira
5. **Melhoria contínua**: Identificar gargalos em cada etapa

## 📋 Checklist de Implementação

- [ ] Executar ALTER TABLE no banco de dados
- [ ] Atualizar dropdown em leads/page.tsx
- [ ] Atualizar badges em leads/page.tsx
- [ ] Verificar se kanban já está OK (já tem parceria_fechada)
- [ ] Atualizar conversionFunnelService.js para incluir funil B2B
- [ ] Testar mudança de status em todas as interfaces
- [ ] Validar que BI de conversão mostra dados corretos

## 🔄 Próximos Passos

Após padronização, criar **BI de Conversão B2B** específico que mostre:
```
[Prospecção] → [Contato] → [Apresentação] → [Negociação] → [Parceria Fechada]
    100 leads    50 (50%)     30 (60%)         15 (50%)        10 (67%)
```

E combinar com funil B2C (SEO → Cadastro → Agendamento → Comparecimento)
