# Branches do Projeto

Este documento descreve as branches utilizadas para as diferentes fases do projeto.

## 🌿 Branches Disponíveis

### Fase 1 - `main` ou `phase1`

**Descrição**: Implementação inicial utilizando métodos separados para obter dados do usuário.

**Métodos utilizados**:
- `ListBasicInformation` - Para obter dados pessoais
- `ListCouncils` - Para listar conselhos profissionais

**Como usar**:
```bash
git checkout main
# ou
git checkout phase1
```

Na Dashboard (`src/views/DashboardView.vue`), configure:
```javascript
const usePhase2 = ref(false)
```

### Fase 2 - `phase2`

**Descrição**: Refatoração para utilizar método único que retorna todos os dados do usuário.

**Métodos utilizados**:
- `GetFullUserInfo` - Retorna dados pessoais e conselhos em uma única requisição

**Como usar**:
```bash
git checkout phase2
```

Na Dashboard (`src/views/DashboardView.vue`), configure:
```javascript
const usePhase2 = ref(true)
```

## 🔄 Diferenças entre as Fases

### Fase 1
- Duas requisições separadas ao carregar dados do usuário
- `loadUserInfoPhase1()` chama `getBasicInformation()` e `listCouncils()` em paralelo
- Mais controle sobre quando carregar cada tipo de dado

### Fase 2
- Uma única requisição para obter todos os dados
- `loadUserInfoPhase2()` chama apenas `getFullUserInfo()`
- Menos requisições à API, melhor performance

## 📝 Como Alternar entre Fases

### Opção 1: Usando Branches Git

```bash
# Para Fase 1
git checkout phase1

# Para Fase 2
git checkout phase2
```

### Opção 2: Modificando o Código

Na Dashboard (`src/views/DashboardView.vue`), altere a variável:

```javascript
// Para Fase 1
const usePhase2 = ref(false)

// Para Fase 2
const usePhase2 = ref(true)
```

## 🚀 Entrega

- **Fase 1**: Branch `main` ou `phase1`
- **Fase 2**: Branch `phase2`

Ambas as branches estão funcionais e prontas para entrega.

