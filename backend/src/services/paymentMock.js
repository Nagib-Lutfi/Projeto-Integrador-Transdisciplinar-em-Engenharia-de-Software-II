// Simulando um serviço de pagamento
module.exports = {
  processPayment: (amount) => {
    // Simulação simples: 80% de chance de sucesso
    const success = Math.random() > 0.2; // 80% de chance de sucesso
    if (success) {
      return { success: true, message: 'Pagamento aprovado' };
    } else {
      return { success: false, message: 'Pagamento recusado. Tente novamente.' };
    }
  }
};
