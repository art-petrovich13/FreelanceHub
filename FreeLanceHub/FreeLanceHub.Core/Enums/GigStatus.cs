namespace FreeLanceHub.Core.Enums;

public enum GigStatus
{
    Pending,    // Только создана, ждёт одобрения Admin
    Active,     // Одобрена, видна всем
    Rejected,   // Отклонена Admin
    Archived    // Скрыта студентом
}