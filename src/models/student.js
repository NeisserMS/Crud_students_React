export class StudentModel {
  constructor(params = {}) {
    this.id = params.id || "";
    this.name = params.name || "";
    this.apellidoP = params.apellidoP || "";
    this.apellidoM = params.apellidoM || "";
    this.anio = params.anio || 0;
    this.grado = params.grado || "";
    this.imageFile = params.imageFile || "";
  }
}
