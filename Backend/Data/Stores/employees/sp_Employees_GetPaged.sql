DROP PROCEDURE IF EXISTS sp_Employees_GetPaged;

CREATE PROCEDURE sp_Employees_GetPaged
(
    @Page INT,
    @PageSize INT,
    @Search VARCHAR(100) = ''
)
AS
BEGIN
    SET NOCOUNT ON;

    -------------------------------------
    -- Total
    -------------------------------------
    SELECT COUNT(*) AS Total
    FROM Employees
    WHERE StatusEmployee = 'A'
      AND (
            @Search = ''
            OR NameEmployee LIKE '%' + @Search + '%'
            OR LastNameEmployee LIKE '%' + @Search + '%'
      );

    -------------------------------------
    -- Datos
    -------------------------------------
    SELECT
        IdEmployee,
        NameEmployee,
        LastNameEmployee,
        Birthdate,
        StatusEmployee,
        CreateAt
    FROM Employees
    WHERE StatusEmployee = 'A'
      AND (
            @Search = ''
            OR NameEmployee LIKE '%' + @Search + '%'
            OR LastNameEmployee LIKE '%' + @Search + '%'
      )
    ORDER BY IdEmployee
    OFFSET (@Page-1)*@PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

END