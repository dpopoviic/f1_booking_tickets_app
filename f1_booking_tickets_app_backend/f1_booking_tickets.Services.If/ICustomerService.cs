using f1_booking_tickets.Domain.Entities;

namespace f1_booking_tickets.Services.If
{
    public interface ICustomerService
    {
        Task<Customer?> GetByIdAsync(int customerId, CancellationToken cancellationToken = default);
        Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<Customer> CreateAsync(Customer customer, CancellationToken cancellationToken = default);
        Task<Customer> UpdateAsync(Customer customer, CancellationToken cancellationToken = default);
    }
}
