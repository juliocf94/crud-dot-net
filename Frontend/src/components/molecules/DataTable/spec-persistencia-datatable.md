# DataTable -- Persistencia del Estado (SPEC)

## Objetivo

La DataTable deberá ser capaz de persistir automáticamente su estado
para que, al regresar a una vista, el usuario continúe exactamente donde
la dejó.

La restauración deberá ocurrir **antes del primer request** al backend.

------------------------------------------------------------------------

# Principios

No persistir únicamente filtros.

Persistir el **estado completo de la tabla**.

``` text
Table State
├── Pagination
├── Sorting
├── Filters
├── Column Visibility
├── Column Order
├── Column Size
├── Row Selection (opcional)
└── Features futuras
```

------------------------------------------------------------------------

# Identificador único

Cada DataTable deberá tener un identificador único.

``` tsx
<DataTable
    tableId="employees"
    ...
/>
```

Este identificador será obligatorio cuando la persistencia esté
habilitada.

------------------------------------------------------------------------

# Persistencia

La persistencia será opcional.

``` tsx
<DataTable
    persist
/>
```

o

``` tsx
<DataTable
    persist={true}
/>
```

También podrá deshabilitarse.

``` tsx
<DataTable
    persist={false}
/>
```

------------------------------------------------------------------------

# Clave del almacenamiento

Formato recomendado:

``` text
datatable:employees
datatable:students
datatable:orders
```

Nunca utilizar nombres genéricos.

------------------------------------------------------------------------

# Modelo persistido

``` ts
interface PersistedTableState {

    version: number;

    pagination: {
        page: number;
        pageSize: number;
    };

    sorting: [];

    filters: {};

    columnVisibility: {};

    columnOrder: [];

    columnSizing: {};

}
```

Las propiedades futuras deberán reutilizar este mismo objeto.

No crear múltiples entradas para una misma tabla.

------------------------------------------------------------------------

# Prioridad

``` text
LocalStorage
      ↓
Props iniciales
      ↓
Valores por defecto
```

------------------------------------------------------------------------

# Flujo esperado

``` text
Usuario abre la vista
        ↓
Leer almacenamiento
        ↓
Restaurar estado
        ↓
Construir DataTable
        ↓
Ejecutar primer request
```

Nunca realizar:

``` text
Request página 1
        ↓
Leer almacenamiento
        ↓
Request página 20
```

------------------------------------------------------------------------

# Sincronización

Actualizar automáticamente el estado persistido cuando cambie:

-   page
-   pageSize
-   sorting
-   filters (no es requerido, dejar la intencionalidad a futuro)
-   columnVisibility (no es requerido, dejar la intencionalidad a futuro)
-   columnOrder (no es requerido, dejar la intencionalidad a futuro)
-   columnSizing (no es requerido, dejar la intencionalidad a futuro)

Sin botón Guardar.
Botón en la Ui para limpiar filtros solo si hay alguno.

------------------------------------------------------------------------

# Responsabilidades

La DataTable no deberá conocer LocalStorage directamente.

Utilizar un hook dedicado.

``` text
usePersistedTableState()
```

------------------------------------------------------------------------

# Abstracción del almacenamiento

Definir un contrato desacoplado.

``` ts
interface DataTableStateStorage {

    load(key: string): PersistedTableState | null;

    save(
        key: string,
        state: PersistedTableState
    ): void;

    remove(key: string): void;

}
```

Implementación inicial:

``` text
LocalStorageTableStateStorage
```

Implementaciones futuras posibles (no es requerido):

-   SessionStorageTableStateStorage
-   IndexedDbTableStateStorage
-   ApiTableStateStorage
-   MemoryTableStateStorage

La DataTable dependerá del contrato, no de la implementación.

------------------------------------------------------------------------

# Escalabilidad (no es requerido pero se debe tomar en cuenta la intesionalidad a futuro)

Las siguientes funcionalidades deberán integrarse reutilizando el mismo
estado:

-   Filtros simples
-   Filtros avanzados
-   Ordenamiento múltiple
-   Toolbar
-   Exportaciones
-   Columnas ocultas
-   Cambio de orden de columnas
-   Redimensionamiento de columnas
-   Selección múltiple
-   Filas expandidas
-   Agrupaciones
-   Búsqueda global

------------------------------------------------------------------------

# Buenas prácticas

-   Responsabilidad única por componente.
-   Hooks especializados.
-   Evitar lógica duplicada.
-   Evitar acoplamiento con la vista.
-   Evitar dependencias directas de LocalStorage.
-   Diseñar para crecimiento sin romper compatibilidad.
-   Mantener una única fuente de verdad para el estado de la tabla.
