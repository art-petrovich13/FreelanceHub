namespace FreeLanceHub.Core.Enums;

public enum ProposalStatus
{
    Pending,   // Подан, ждёт решения работодателя
    Accepted,  // Принят — этот студент выбран исполнителем
    Rejected   // Отклонён (вручную или автоматически при выборе другого)
}