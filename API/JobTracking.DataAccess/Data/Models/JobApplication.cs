using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using JobTracking.DataAccess.Data.Base;

namespace JobTracking.DataAccess.Data.Models;

public class JobApplication : IEntity
{
    [Key]
    public int Id { get; set; }
    public bool IsActive { get; set; }                                                                                                                                                            
    public DateTime CreatedOn { get; set; }
    
    [NotNull] 
    public /*required*/ string CreatedBy { get; set; }/* = null!;*/
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }

    [Required]
    public int UserID { get; set; }
    
    public virtual User User { get; set; }
}