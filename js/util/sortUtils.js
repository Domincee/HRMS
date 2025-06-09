export function sortEmployees(column, asc = true) {
  return [...employeesFromRecord].sort((a, b) => {
    let aVal, bVal;

    switch (column) {
      case 'id':
        aVal = a.id;
        bVal = b.id;
        break;
      case 'name':
        aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
        bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
        break;
      case 'department':
        aVal = a.department.toLowerCase();
        bVal = b.department.toLowerCase();
        break;
      case 'status':
        aVal = a.status ? 1 : 0;
        bVal = b.status ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return asc ? -1 : 1;
    if (aVal > bVal) return asc ? 1 : -1;
    return 0;
  });
}
