export function parsearYYMMDD(date: Date): string {
  const fecha = new Date(date);
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export function convertDateToDDMMYYYY(dateString: string): string {
const [year, month, day] = dateString.split('-');
return `${year}-${month}-${day}`;
}
