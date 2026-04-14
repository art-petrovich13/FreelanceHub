using FreeLanceHub.Core.DTOs.Proposals;

namespace FreeLanceHub.Core.Interfaces;

public interface IProposalService
{
    /// <summary>
    /// Список откликов на конкретный заказ.
    /// Доступно только работодателю-владельцу заказа.
    /// </summary>
    Task<List<ProposalDto>> GetByOrderIdAsync(Guid orderId, string employerId);

    /// <summary>
    /// Мои отклики — список заказов на которые подал студент.
    /// </summary>
    Task<List<ProposalDto>> GetByStudentIdAsync(string studentId);

    /// <summary>
    /// Подать отклик. Студент может подать только один отклик на один заказ.
    /// </summary>
    Task<Guid> CreateAsync(string studentId, CreateProposalDto dto);

    /// <summary>
    /// Принять отклик. Автоматически: отклоняет остальных, переводит заказ в InProgress.
    /// </summary>
    Task AcceptAsync(Guid proposalId, string employerId);

    /// <summary>
    /// Отклонить конкретный отклик вручную.
    /// </summary>
    Task RejectAsync(Guid proposalId, string employerId);
}