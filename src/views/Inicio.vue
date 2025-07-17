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
                <h2>Periodo: SEGUNDO</h2>
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
                <p>Estudiante: <br><b>{{datosEstudiante.nombre}}</b></p>
                <p>Documento: <br><b>{{datosEstudiante.documento}}</b></p>
                <p>Grado-Curso: <br><b>{{datosEstudiante.curso}}</b></p>
                <p>Jornada: <br><b>{{datosEstudiante.jornada}}</b></p>
                <p>Sede: <br><b>{{datosEstudiante.sede}}</b></p>
                <b-button class="small mt-1" variant="success" @click="imprimirReportes()">Consultar Informe de Evaluación</b-button>
              </b-col>
            </b-row>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <div v-if="idNivel == 1">
      <BoletinPree
        v-if="mostrarBoletines"
        :estudiantesSeleccionados="estudiantesSeleccionados"
        :listaAreasAsignaturas="listaAreasAsignaturas"
        :listaDescriptores="listaDescriptores"
        :notas="notas"
        :datosEstudiantes="datosEstudiantes"
        :anio="2025"
        :periodoActual="idPeriodo"
        :periodosVisibles="periodosVisibles"
        :nombreSede="nombreSede"
        :nombreCurso="nombreCurso"
        :nombrePeriodo="nombrePeriodo"
        :nombreJornada="nombreJornada"
        :nombreDirector="nombreDirector"
        :idNivel="idNivel"
        :umbralesA="umbralesA"
        :umbralesT="umbralesT"
        :pesosPeriodos="pesosPeriodos"
        :tipoValComp="tipoValComp"
        :directorCurso="nombreDirector"
        :coordinador="coordinador"
        :promCompor="promCompor"
        :escalaPreescolar="escalaPreescolar"
        :nuevaEscalaPreescolar="nuevaEscalaPreescolar"
        :escudoIE="escudoIE"
        :nombreIE="nombreIE"
      />
    </div>
    <div v-else>
      <BoletinPeriodo
        v-if="mostrarBoletines"
        :estudiantesSeleccionados="estudiantesSeleccionados"
        :listaAreasAsignaturas="listaAreasAsignaturas"
        :listaDescriptores="listaDescriptores"
        :notas="notas"
        :datosEstudiantes="datosEstudiantes"
        :anio="2025"
        :periodoActual="idPeriodo"
        :periodosVisibles="periodosVisibles"
        :nombreSede="nombreSede"
        :nombreCurso="nombreCurso"
        :nombrePeriodo="nombrePeriodo"
        :nombreJornada="nombreJornada"
        :nombreDirector="nombreDirector"
        :idNivel="idNivel"
        :umbralesA="umbralesA"
        :umbralesT="umbralesT"
        :pesosPeriodos="pesosPeriodos"
        :tipoValComp="tipoValComp"
        :promCompor="promCompor"
        :letrasCompor="letrasCompor"
        :directorCurso="nombreDirector"
        :coordinador="coordinador"
        :escudoIE="escudoIE"
        :nombreIE="nombreIE"
      />
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";
  import BoletinPeriodo from '@/views//BoletinPeriodo'
  import BoletinPree from '@/views/BoletinPree'

  export default {
    name: 'Inicio',
    mixins: [validationMixin],
    components: {
      BoletinPeriodo,
      BoletinPree
    },
    data () {
      return {
        idBoletin: null,
        idSede: null,
        comboSedes: [],
        idPeriodo: null,
        comboPeriodos: null,
        idCurso: null,
        comboCursosSede: [],
        nombreSede: null,
        nombreCurso: null,
        nombrePeriodo: null,
        nombreJornada: null,
        nombreDirector: null,
        coordinador: null,
        idNivel: null,
        btnCargando: false,
        datosSeccion: {},
        estudiantesSeleccionados: [],
        datosEstudiantes: [],
        listaAreasAsignaturas: [],
        listaDescriptores: [],
        notas: [],
        periodosVisibles: [],
        mostrarBoletines: false,
        umbralesA: [],
        umbralesT: [],
        pesosPeriodos: [],
        tipoValComp: null,
        promCompor: null,
        firma2: null,
        escalaPreescolar: {},
        nuevaEscalaPreescolar: [],
        letrasCompor: [],

        listaReportes: [],
        datosEstudiante: {},
        buscarTexto: {
          textoBusqueda: null,
        },
        alcaldia: null,
        secretaria: null,
        encontrado: false,
        escudoIE: '',
        nombreIE: '',
      }
    },
    validations: {
      buscarTexto: {
        textoBusqueda: { required, minLength: minLength(0) }
      }
    },
    methods: {
      async imprimirReportes() {
        this.btnCargando = true
        this.listaReportes = []
        let puesto = ''
        if (this.idNivel == 99) {
          this.listaReportes = []
          this.listaReportes.push({ 'id': this.datosEstudiante.idMatricula, 'estudiante': this.datosEstudiante.nombre, 'pue': '', 'pro': '' })
          let uri = "?datos=" + JSON.stringify(this.listaReportes) + "&ie=" + this.datosEstudiante.institucion + "&vigencia=" + "2025" + "&escudo=" + this.datosEstudiante.escudo + "&sede=" + this.datosEstudiante.sede + "&idCurso=" + this.datosEstudiante.idCurso + "&curso=" + this.datosEstudiante.curso + "&jornada=" + this.datosEstudiante.jornada + "&director=" + this.datosEstudiante.director + "&periodo=" + "SEGUNDO" + "&idPeriodo=" + this.idPeriodo + "&idIe=" + this.datosEstudiante.idInstitucion + "&idNivel=" + this.datosEstudiante.idNivel + "&puesto=" + "" +
          "&minBaj=" + this.datosEstudiante.minBaj + "&maxBaj=" + this.datosEstudiante.maxBaj + "&minBas=" + this.datosEstudiante.minBas + "&maxBas=" + this.datosEstudiante.maxBas + "&minAlt=" + this.datosEstudiante.minAlt + "&maxAlt=" + this.datosEstudiante.maxAlt + "&minSup=" + this.datosEstudiante.minSup + "&maxSup=" + this.datosEstudiante.maxSup
          let encoded = encodeURI(uri);
          //window.open("http://localhost/siedutunja/php/boletines/" + this.datosEstudiante.dane + "as.php" + encoded,"_blank")
          window.open("https://siedutunja.gov.co/php/boletines/" + this.datosEstudiante.dane + "as.php" + encoded,"_blank")
        } else {
          this.btnCargando = true
          this.mostrarBoletines = true
          this.listaReportes.push({ 'idMatricula': this.datosEstudiante.idMatricula, 'nombre': this.datosEstudiante.nombre })
          this.estudiantesSeleccionados = this.listaReportes
          if (this.idPeriodo == 1) this.periodosVisibles = [1]
          if (this.idPeriodo == 2) this.periodosVisibles = [1,2]
          if (this.idPeriodo == 3) this.periodosVisibles = [1,2,3]
          if (this.idPeriodo == 4) this.periodosVisibles = [1,2,3,4]
          this.umbralesA = [this.datosEstudiante.minBas,this.datosEstudiante.minAlt,this.datosEstudiante.minSup,this.datosEstudiante.maxSup]
          this.umbralesT = [this.datosEstudiante.minBasT,this.datosEstudiante.minAltT,this.datosEstudiante.minSupT,this.datosEstudiante.maxSupT]
          this.pesosPeriodos = [this.datosEstudiante.pesoP1,this.datosEstudiante.pesoP2,this.datosEstudiante.pesoP3,this.datosEstudiante.pesoP4]
          this.tipoValComp = this.datosEstudiante.tipoValComp
          this.promCompor = this.datosEstudiante.promCompor
          this.escalaPreescolar = {I: this.datosEstudiante.minBaj, B: this.datosEstudiante.minBas, A: this.datosEstudiante.minAlt, S: this.datosEstudiante.maxSup}
          this.nuevaEscalaPreescolar = [
            {letra: this.datosEstudiante.preeL1, umbral: this.datosEstudiante.minBaj, desempeno: this.datosEstudiante.preeC1},
            {letra: this.datosEstudiante.preeL2, umbral: this.datosEstudiante.minBas, desempeno: this.datosEstudiante.preeC2},
            {letra: this.datosEstudiante.preeL3, umbral: this.datosEstudiante.minAlt, desempeno: this.datosEstudiante.preeC3},
            {letra: this.datosEstudiante.preeL4, umbral: this.datosEstudiante.maxSup, desempeno: this.datosEstudiante.preeC4},
          ]
          this.letrasCompor = [this.datosEstudiante.compL1,this.datosEstudiante.compL2,this.datosEstudiante.compL3,this.datosEstudiante.compL4]
          //console.log(this.estudiantesSeleccionados)
          // this.firma2 =  Asignar la firma que va en el boletin
          setTimeout(()=>{
            this.btnCargando = false
          },500)
        }
      },
      async consultarEstudiantes() { 
        this.btnCargando = true
        this.mostrarBoletines = false
        if (this.idCurso != null) { 
          this.nombreJornada = this.datosEstudiante.jornada
          this.nombreDirector = this.datosEstudiante.director
          this.idNivel = this.datosEstudiante.idNivel
          if (this.idNivel == 1 && (this.datosEstudiante.idInstitucion == '17ee4f30-fc80-11ec-a1d1-1dc2835404e5' || this.datosEstudiante.idInstitucion == '097b7b10-fcaa-11ec-8267-536b07c743c4')) {
            this.idNivel = 99
          }
          this.nombreSede = this.datosEstudiante.sede
          this.nombreCurso = this.datosEstudiante.curso
          this.nombrePeriodo = "SEGUNDO"
          this.datosEstudiantes = []
          await axios
          .get(CONFIG.ROOT_PATH + 'boletines/listacurso/boletines', { params: { idCurso: this.idCurso }})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consulta Lista Curso')
              this.btnCargando = false
            } else{
              if (response.data.datos != 0) {
                this.datosEstudiantes = response.data.datos
                //console.log(JSON.stringify(this.datosEstudiantes))
                if (this.idNivel !== 99 ) {
                  this.consultarNotas()
                  this.consultarAreasAsignaturas()
                  this.consultarDescriptores()
                }
              }
            }
          })
          .catch(err => {
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Lista Curso. Intente más tarde.' + err)
            this.btnCargando = false
          })
        }
        //console.log(JSON.stringify(this.datosEstudiantes))
        this.btnCargando = false
      },
      async consultarNotas() {
        this.notas = []
        await axios
        .get(CONFIG.ROOT_PATH + 'boletines/notas/curso/periodo', {params: {idCurso: this.idCurso, periodo: this.idPeriodo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas boletines curso periodo')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.notas = response.data.datos
              //console.log(JSON.stringify(this.notas))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas boletines curso periodo. Intente más tarde.' + err)
          this.btnCargando = false
        })
      },
      async consultarAreasAsignaturas() {
        this.listaAreasAsignaturas = []
        await axios
        .get(CONFIG.ROOT_PATH + 'boletines/areasasignaturas/curso', {params: {idCurso: this.idCurso}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Lista areas-asignaturas curso')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.listaAreasAsignaturas = response.data.datos
              //console.log(JSON.stringify(this.listaAreasAsignaturas))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Lista areas-asignaturas curso. Intente más tarde.' + err)
          this.btnCargando = false
        })
      },
      async consultarDescriptores() {
        this.listaDescriptores = []
        await axios
        .get(CONFIG.ROOT_PATH + 'boletines/descriptores/curso', {params: {idCurso: this.idCurso, periodo: this.idPeriodo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Lista descriptores curso')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.listaDescriptores = response.data.datos
              //console.log(JSON.stringify(this.listaDescriptores))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Lista descriptores curso. Intente más tarde.' + err)
          this.btnCargando = false
        })
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
          .get(CONFIG.ROOT_PATH + 'academico/buscarestudiante/documento/reporte', { params: { texto: this.buscarTexto.textoBusqueda }})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consultar estudiante')
            } else{
              if (response.data.datos != 0) {
                this.datosEstudiante = response.data.datos
                this.encontrado = true
                this.idCurso = this.datosEstudiante.idCurso
                this.escudoIE = this.datosEstudiante.escudo
                this.nombreIE = this.datosEstudiante.institucion
                this.consultarEstudiantes()
                //console.log(JSON.stringify(this.datosEstudiante))
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
      this.idPeriodo = 2
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
