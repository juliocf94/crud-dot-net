DROP PROCEDURE IF EXISTS sp_Employees_GetPaged;
GO

CREATE PROCEDURE sp_Employees_GetPaged
(
    @Page INT,
    @PageSize INT,
    @Search VARCHAR(100) = ''
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Total INT;

    -------------------------------------
    -- Total
    -------------------------------------
    SELECT
        @Total = COUNT(*)
    FROM Employees
    WHERE StatusEmployee = 'A'
      AND (
            @Search = ''
            OR NameEmployee LIKE '%' + @Search + '%'
            OR LastNameEmployee LIKE '%' + @Search + '%'
      );

    SELECT
        @Total AS Total,
        @Page AS Page,
        @PageSize AS PageSize,
        CAST(
            CASE
                WHEN @PageSize > 0
                    THEN CEILING(CAST(@Total AS DECIMAL(18,2)) / @PageSize)
                ELSE 0
            END
        AS INT) AS TotalPages;

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
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

END;
GO