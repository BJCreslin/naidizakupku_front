/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU')
}

/**
 * Форматирует денежную сумму в читаемый вид
 */
export function formatBudget(amount: number): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000
    return `${billions.toFixed(1).replace('.0', '')}B ₽`
  }
  
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return `${millions.toFixed(0)}M ₽` 
  }
  
  if (amount >= 1_000) {
    const thousands = amount / 1_000
    return `${thousands.toFixed(0)}K ₽`
  }
  
  return `${amount} ₽`
} 