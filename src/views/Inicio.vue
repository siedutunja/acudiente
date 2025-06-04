<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CCard>
              <CCardFooter style="background: rgb(204, 8, 132, 0.879); margin-top: -40; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);">
                <CRow>
                  <!--
                  <CCol lg="2" md="3">
                    <div class="text-center">
                      <b-avatar class="c-sidebar-brand-minimized" variant="light" :src="escudoInstitucion"  size="6rem"></b-avatar>
                    </div>
                  </CCol>
                  -->
                  <CCol lg="12" md="6">
                    <div class="mt-2 text-center">
                      <h6 style="margin-top: -5" class="text-white">{{ alcaldia }}</h6>
                      <h6 style="margin-top: -5" class="text-white">{{ secretaria }}</h6>
                      <h4 style="margin-top: -5" class="text-white">{{ nombreInstitucion }}</h4>
                      <h6 style="margin-top: -5" class="text-white">TUNJA - BOYACÁ</h6>
                    </div>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
            <b-row class="mt-5">
              <b-col lg="6">
                <h2>Consulta de Informe de Evaluación</h2>
              </b-col>
              <b-col lg="6">
                <h2>Periodo: PRIMERO</h2>
              </b-col>
            </b-row>
            <b-row><b-col><hr></b-col></b-row>
            <b-row>
              <b-col lg="6" md="6">
                <b-form-group label="Número de Documento del Estudiante*" label-for="texto" class="etiqueta">
                  <b-form-input id="texto" ref="texto" v-model.trim="$v.buscarTexto.textoBusqueda.$model" :state="validateStateT('textoBusqueda')" aria-describedby="feedTextoB" autocomplete="off" maxlength="50" v-on:keyup.enter="buscarEstudiante()" autofocus></b-form-input>
                  <b-form-invalid-feedback id="feedTextoB" >Campo requerido.</b-form-invalid-feedback>
                </b-form-group>
                <p>
                  Realice la consulta digitando el número de documento sin puntos ni comas.
                </p>
              </b-col>
              <b-col lg="6" md="6">
                <br>
                <b-button class="small mt-1" variant="primary" @click="buscarEstudiante()">Consultar Estudiante</b-button>
              </b-col>
            </b-row>
            <b-row><b-col><hr></b-col></b-row>
            <b-row v-if="encontrado">
              <b-col>
                <p>Estudiante: <br><b>{{datosEstudiante.estudiante}}</b></p>
                <p>Documento: <br><b>{{datosEstudiante.documento}}</b></p>
                <p>Grado-Curso: <br><b>{{datosEstudiante.nomenclatura}}</b></p>
                <p>Jornada: <br><b>{{datosEstudiante.jornada}}</b></p>
                <p>Sede: <br><b>{{datosEstudiante.sede}}</b></p>
                <b-button class="small mt-1" variant="success" @click="imprimirReportes()">Consultar Informe de Evaluación</b-button>
              </b-col>
            </b-row>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";

  export default {
    name: 'Inicio',
    mixins: [validationMixin],
    data () {
      return {
        idInstitucion: '660fa760-fc83-11ec-a1d1-1dc2835404e5', // GRANCOLOMBIANO
        //idInstitucion: 'f5529ba0-fcb3-11ec-8267-536b07c743c4', // GUSTAVO ROJAS
        //idInstitucion: '17ee4f30-fc80-11ec-a1d1-1dc2835404e5', // ENSLAP
        //idInstitucion: '7c63ed50-fcb0-11ec-8267-536b07c743c4', // SANTIAGO
        //idInstitucion: 'acaa36d0-fcb1-11ec-8267-536b07c743c4', // EMILIANI
        vigencia: '2025',
        periodo: 'PRIMERO',
        idPeriodo: 1,
        nombreInstitucion: 'INSTITUCIÓN EDUCATIVA GIMNASIO GRAN COLOMBIANO',
        //nombreInstitucion: 'INSTITUCIÓN EDUCATIVA GUSTAVO ROJAS PINILLA',
        //nombreInstitucion: 'ESCUELA NORMAL SUPERIOR LEONOR ALVAREZ PINZÓN',
        //nombreInstitucion: 'ESCUELA NORMAL SUPERIOR SANTIAGO DE TUNJA',
        //nombreInstitucion: 'INSTITUCIÓN EDUCATIVA SAN JERÓNIMO EMILIANI',
        escudoInstitucion: 'escudo-gimnasiogc.png',
        //escudoInstitucion: 'escudo-iegrp.png',
        //escudoInstitucion: 'escudo-enslap.png',
        //escudoInstitucion: 'escudo-ensst.png',
        //escudoInstitucion: 'escudo-emiliani.png',
        daneInstitucion: '315001000293',
        //daneInstitucion: '115001002807',
        //daneInstitucion: '115001002017',
        //daneInstitucion: '115001000430',
        //daneInstitucion: '315001001613',
        datosEstudiante: {},
        buscarTexto: {
          textoBusqueda: null,
        },
        alcaldia: null,
        secretaria: null,
        encontrado: false,
      }
    },
    validations: {
      buscarTexto: {
        textoBusqueda: { required, minLength: minLength(0) }
      }
    },
    methods: {
      async imprimirReportes() {
        let listaReportes = []
        let puesto = ''
        listaReportes.push({ 'id': this.datosEstudiante.idMatricula, 'estudiante': this.datosEstudiante.estudiante, 'pue': '', 'pro': '' })

        let uri = "?datos=" + JSON.stringify(listaReportes) + "&ie=" + this.nombreInstitucion + "&vigencia=" + this.vigencia + "&escudo=" + this.escudoInstitucion + "&sede=" + this.datosEstudiante.sede + "&idCurso=" + this.datosEstudiante.id_curso + "&curso=" + this.datosEstudiante.nomenclatura + "&jornada=" + this.datosEstudiante.jornada + "&director=" + this.datosEstudiante.director + "&periodo=" + this.periodo + "&idPeriodo=" + this.idPeriodo + "&idIe=" + this.idInstitucion + "&idNivel=" + this.datosEstudiante.id_nivel + "&puesto=" + puesto +
        "&minBaj=" + 1 + "&maxBaj=" + 3.4 + "&minBas=" + 3.5 + "&maxBas=" + 3.9 + "&minAlt=" + 4 + "&maxAlt=" + 4.5 + "&minSup=" + 4.6 + "&maxSup=" + 5
        let encoded = encodeURI(uri);
        //window.open("http://localhost/siedutunja/php/boletines/" + this.daneInstitucion + "as.php" + encoded,"_blank")
        window.open("https://siedutunja.gov.co/php/boletines/" + this.daneInstitucion + "as.php" + encoded,"_blank")
        return true
      },
      async buscarEstudiante() {
        this.datosEstudiante = {}
        this.encontrado = false
        this.$v.buscarTexto.$touch()
        if (this.$v.buscarTexto.$anyError) {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La consulta esta vacia.')
          this.$refs.texto.focus()
          return false
        } else {
          await axios
          .get(CONFIG.ROOT_PATH + 'academico/buscarestudiante/documento/reporte', { params: { texto: this.buscarTexto.textoBusqueda, idInstitucion: this.idInstitucion, vigencia: this.vigencia }})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consultar estudiante')
            } else{
              if (response.data.datos != 0) {
                this.datosEstudiante = response.data.datos
                this.encontrado = true
                //console.log(JSON.stringify(response.data.datos))
              } else {
                this.mensajeEmergente('info',CONFIG.TITULO_MSG,'No se encontraron datos en la consulta.')
              }
            }
          })
          .catch(err => {
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Consultar estudiante. Intente más tarde. ' + err)
          })
        }
        return true
      },
      validateStateT(name) {
        const { $dirty, $error } = this.$v.buscarTexto[name]
        return $dirty ? !$error : null
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      //this.escudoInstitucion = CONFIG.ROOT_ESCUDOS + this.$store.state.escudoInstitucion
      this.secretaria = CONFIG.SECRETARIA
      this.alcaldia = CONFIG.ALCALDIA
    }
  }
</script>

<style>
  .linkini:hover {
    position: relative;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    background: rgba(149, 195, 247, 0.108);
    cursor: pointer;
    color: rgba(204, 8, 132, 0.879);
    /*background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);*/
  }
</style>
