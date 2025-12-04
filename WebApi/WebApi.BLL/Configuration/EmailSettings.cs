namespace WebApi.BLL.Configuration;

public class EmailSettings
{
    public string SmtpHost { get; set; } = "";
    public int SmtpPort { get; set; }
    public string UserEmail { get; set; } = "";
    public string Password { get; set; } = "";
}
