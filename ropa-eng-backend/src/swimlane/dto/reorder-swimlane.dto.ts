export class ReordereSwimlaneDto {
    departmentId: number;
    items: ReordereSwimlaneItemDto[];
  }
  export class ReordereSwimlaneItemDto {
    id: number;
    order: number;
  }
  