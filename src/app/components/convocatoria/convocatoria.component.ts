import { Component, OnInit, Input } from '@angular/core';
import { EstructuraCrud } from 'src/app/modelos/estructura-crud';
import { Convocatoria } from './../../modelos/convocatoria.model';
import Swal from 'sweetalert2';
import { ConvocatoriaCrudService } from 'src/app/services/convocatoria.crud.service';

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css']
})
export class ConvocatoriaComponent implements OnInit, EstructuraCrud {

  estado = 0;
  convocatorias: any[] = [];
  convocatoriaTemp: Convocatoria = new Convocatoria();
  user: any;
  
  constructor(private servicioFirebase: ConvocatoriaCrudService) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.listar();
  }

  validarConvocatoriasVistas(convocatoria: Convocatoria): boolean {
    return convocatoria.UID === this.user.uid;
  }

  listar(): void {
    this.servicioFirebase.listar().subscribe(data => {
      this.convocatorias = data.map(elemento => {
        return {
          ...elemento as Convocatoria
        }
      });
    });
  }

  guardar(): void {
    if (this.validarFormulario()) {
      if (this.estado == 0) {
        this.crear();
      } else {
        this.modificar();
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Debe llenar los campos para poder guardar.',
        type: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  private validarFormulario(): boolean {
    return this.convocatoriaTemp.formulario.controls['fechaInicio'].value !== ''
    && this.convocatoriaTemp.formulario.controls['fechaInicio'].value !== null
    && this.convocatoriaTemp.formulario.controls['fechaInicio'].value !== undefined
    && this.convocatoriaTemp.formulario.controls['fechaFin'].value !== ''
    && this.convocatoriaTemp.formulario.controls['fechaFin'].value !== null
    && this.convocatoriaTemp.formulario.controls['fechaFin'].value !== undefined
    && this.convocatoriaTemp.formulario.controls['profesion'].value !== ''
    && this.convocatoriaTemp.formulario.controls['profesion'].value !== null
    && this.convocatoriaTemp.formulario.controls['profesion'].value !== undefined
    && this.convocatoriaTemp.formulario.controls['descripcion'].value !== ''
    && this.convocatoriaTemp.formulario.controls['descripcion'].value !== null
    && this.convocatoriaTemp.formulario.controls['descripcion'].value !== undefined
    && this.convocatoriaTemp.formulario.controls['habilidades'].value !== ''
    && this.convocatoriaTemp.formulario.controls['habilidades'].value !== null
    && this.convocatoriaTemp.formulario.controls['habilidades'].value !== undefined
  }

  crear(): void {
    this.convocatoriaTemp.formulario.controls['UID'].setValue(this.user.uid);
    console.log(this.servicioFirebase.create(this.convocatoriaTemp.formulario.value));
    this.convocatoriaTemp.formulario.reset();
  }

  modificar(): void {
    console.log(this.servicioFirebase.update(this.convocatoriaTemp.id, this.convocatoriaTemp.formulario.value));
    this.convocatoriaTemp = new Convocatoria();
    this.estado = 0;
  }

  eliminar(evento: any, id: string): void {
    if (evento) {
      console.log(this.servicioFirebase.delete(id));
    }
  }

  buscar(id: string): void {
    this.servicioFirebase.buscar(id).subscribe(a => {
      let data = a.payload.data() as any;
      this.convocatoriaTemp.id = a.payload.id;
      this.convocatoriaTemp.formulario.setValue(data);
      this.estado = 1;
    });
  }
}