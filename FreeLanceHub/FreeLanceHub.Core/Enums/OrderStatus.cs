namespace FreeLanceHub.Core.Enums;

public enum OrderStatus
{
    Open,        // Опубликован, принимает отклики
    InProgress,  // Исполнитель выбран, работа идёт
    Completed,   // Заказ завершён обеими сторонами
    Cancelled,   // Отменён работодателем
    Rejected     // Отклонён Admin
}