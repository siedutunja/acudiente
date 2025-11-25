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
              <b-col lg="12">
                <h2>Consulta de Estudiante</h2>
                <hr>
              </b-col>
              <b-col lg="12">
                <b-alert variant="success" show>
                  <b-form-group label="Seleccione la Institución Educativa:" label-for="ie" class="etiqueta">
                    <b-form-select id="ie" ref="ie" v-model="idInstitucion" :options="comboInstituciones" @change="buscarTexto.textoBusqueda=null,encontrado=false,configuracionIE()"></b-form-select>
                  </b-form-group>
                </b-alert>
              </b-col>
            </b-row>
            <b-row v-if="fechaConsulta">
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
                <b-button class="small mt-1" variant="success" @click="buscarEstudiante()">Consultar Estudiante</b-button>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col lg="12">
                <b-alert v-if="idInstitucion != null" variant="danger" show><b>Lo sentimos!. El periodo de consulta se encuentra cerrado.</b><br>Por favor intente mas tarde hacer la consulta o comuniquese con su Institución Educativa.</b-alert>
              </b-col>
            </b-row>
            <div v-if="encontrado">
              <b-row><b-col><hr></b-col></b-row>
              <b-row>
                <b-col>
                  <b-alert variant="secondary" show>
                    <h2 class="text-center">Estudiante Consultado</h2>
                    <hr>
                    <b-row>
                      <b-col lg="6"><p>Apellidos y Nombres: <br><b><span style="font-size: 16px">{{datosEstudiante.nombre}}</span></b></p></b-col>
                      <b-col lg="6"><p>Sede: <br><b><span style="font-size: 16px">{{datosEstudiante.sede}}</span></b></p></b-col>
                    </b-row>
                    <b-row>
                      <b-col lg="6"><p>Documento: <br><b><span style="font-size: 16px">{{datosEstudiante.documento}}</span></b></p></b-col>
                      <b-col lg="6"><p>Grado-Curso: <br><b><span style="font-size: 16px">{{datosEstudiante.curso}}</span></b></p></b-col>
                    </b-row>
                  </b-alert>
                </b-col>
              </b-row>
              <b-row v-if="actualizarFicha == 1 && actFicha == 0">
                <b-col lg="12" class="mt-3">
                  <h3>Actualización de Datos del Estudiante</h3>
                  <p>Para actualizar la información del estudiante es necesario hacer clic en cada una de las fichas y actualizar los datos solicitados.</p>
                  <ul>
                    <li>Las fichas que no se han actualizado estarán enmarcadas en color rojo.</li>
                    <li>Las fichas actualizadas correctamente se enmarcaran en color verde.</li>
                  </ul>
                  <p>Una vez que todas las fichas esten en color verde, se visualizará un botón para confirmar y dar por finalizada la actualización de la información. Posteriormente podrá consultar y descargar el boletín de evaluaciones por periodo.</p>
                </b-col>
                <b-col lg="3">
                  <b-alert variant="secondary" class="text-center" show>
                    <img :src="foto" id="photoA" alt="photo" width="30%"><br><br>
                    <b-button class="small mt-1" :variant="fichaE ? 'outline-success' : 'outline-danger'" @click="verFichaEstudiante()">Actualizar Ficha del Estudiante</b-button>
                  </b-alert>
                </b-col>
                <b-col lg="3">
                  <b-alert variant="secondary" class="text-center" show>
                    <img :src="foto" id="photoA" alt="photo" width="30%"><br><br>
                    <b-button class="small mt-1" :variant="fichaP ? 'outline-success' : 'outline-danger'" @click="verFichaPapa()">Actualizar Ficha del Papá</b-button>
                  </b-alert>
                </b-col>
                <b-col lg="3">
                  <b-alert variant="secondary" class="text-center" show>
                    <img :src="foto" id="photoA" alt="photo" width="30%"><br><br>
                    <b-button class="small mt-1" :variant="fichaM ? 'outline-success' : 'outline-danger'" @click="verFichaMama()">Actualizar Ficha de la Mamá</b-button>
                  </b-alert>
                </b-col>
                <b-col lg="3">
                  <b-alert variant="secondary" class="text-center" show>
                    <img :src="foto" id="photoA" alt="photo" width="30%"><br><br>
                    <b-button class="small mt-1" :variant="fichaA ? 'outline-success' : 'outline-danger'" @click="verFichaAcudiente()">Actualizar Ficha del Acudiente</b-button>
                  </b-alert>
                </b-col>
                <b-col lg="12" class="text-center mt-3" v-if="fichaE && fichaP && fichaM && fichaA">
                  <hr>
                  <b-button class="mt-1" variant="success" @click="finalizarActualizacion()">Dar por finalizada la Actualización de Datos del Estudiante</b-button>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col lg="6" v-if="consultaBoletin == 1">
                  <b-button class="small mt-1" variant="primary" @click="imprimirReportes()">Consultar Boletin de Evaluaciones</b-button>
                </b-col>
                <b-col lg="6" v-if="consultaObservador == 1">
                  <b-button class="small mt-1" variant="primary" @click="consultarObservador">Consultar Observador del Estudiante</b-button>
                </b-col>
              </b-row>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <div v-if="encontrado">
      <div v-if="idNivel == 1">
        <BoletinPree
          v-if="mostrarBoletines"
          :estudiantesSeleccionados="estudiantesSeleccionados"
          :listaAreasAsignaturas="listaAreasAsignaturas"
          :listaDescriptores="listaDescriptores"
          :notas="notas"
          :datosEstudiantes="datosEstudiantes"
          :anio="Number(aLectivo)"
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
        <span v-if="idInstitucion == 'eb58bf60-fc83-11ec-a1d1-1dc2835404e5'"> <!-- INEM -->
          <BoletinPeriodoInem v-if="mostrarBoletines" :estudiantesSeleccionados="estudiantesSeleccionados" :listaAreasAsignaturas="listaAreasAsignaturas" :listaDescriptores="listaDescriptores" :notas="notas" :datosEstudiantes="datosEstudiantes" :anio="Number(aLectivo)" :periodoActual="idPeriodo" :periodosVisibles="periodosVisibles" :nombreSede="nombreSede" :nombreCurso="nombreCurso" :nombrePeriodo="nombrePeriodo" :nombreJornada="nombreJornada" :nombreDirector="nombreDirector" :idNivel="idNivel" :umbralesA="umbralesA" :umbralesT="umbralesT" :pesosPeriodos="pesosPeriodos" :tipoValComp="tipoValComp" :promCompor="promCompor" :letrasCompor="letrasCompor" :firmasBoletin="firmasBoletin" :descC1="descC1" :descC2="descC2" :descC3="descC3" :idGrado="idGrado" />
        </span>
        <span v-else-if="idInstitucion == '660fa760-fc83-11ec-a1d1-1dc2835404e5'"> <!-- GRANCOLOMBIANO -->
          <BoletinPeriodoGranColombiano v-if="mostrarBoletines" :estudiantesSeleccionados="estudiantesSeleccionados" :listaAreasAsignaturas="listaAreasAsignaturas" :listaDescriptores="listaDescriptores" :notas="notas" :datosEstudiantes="datosEstudiantes" :anio="Number(aLectivo)" :periodoActual="idPeriodo" :periodosVisibles="periodosVisibles" :nombreSede="nombreSede" :nombreCurso="nombreCurso" :nombrePeriodo="nombrePeriodo" :nombreJornada="nombreJornada" :nombreDirector="nombreDirector" :idNivel="idNivel" :umbralesA="umbralesA" :umbralesT="umbralesT" :pesosPeriodos="pesosPeriodos" :tipoValComp="tipoValComp" :promCompor="promCompor" :letrasCompor="letrasCompor" :firmasBoletin="firmasBoletin" :descC1="descC1" :descC2="descC2" :descC3="descC3" :idGrado="idGrado" />
        </span>
        <span v-else-if="idInstitucion == 'f5529ba0-fcb3-11ec-8267-536b07c743c4'"> <!-- GUSTAVOROJAS -->
          <BoletinPeriodoGustavoRojas v-if="mostrarBoletines" :estudiantesSeleccionados="estudiantesSeleccionados" :listaAreasAsignaturas="listaAreasAsignaturas" :listaDescriptores="listaDescriptores" :notas="notas" :datosEstudiantes="datosEstudiantes" :anio="Number(aLectivo)" :periodoActual="idPeriodo" :periodosVisibles="periodosVisibles" :nombreSede="nombreSede" :nombreCurso="nombreCurso" :nombrePeriodo="nombrePeriodo" :nombreJornada="nombreJornada" :nombreDirector="nombreDirector" :idNivel="idNivel" :umbralesA="umbralesA" :umbralesT="umbralesT" :pesosPeriodos="pesosPeriodos" :tipoValComp="tipoValComp" :promCompor="promCompor" :letrasCompor="letrasCompor" :firmasBoletin="firmasBoletin" :descC1="descC1" :descC2="descC2" :descC3="descC3" :idGrado="idGrado" />
        </span>
        <span v-else-if="idInstitucion == 'bd226a20-fc82-11ec-a1d1-1dc2835404e5'"> <!-- JULIUS -->
          <BoletinPeriodoJulius v-if="mostrarBoletines" :estudiantesSeleccionados="estudiantesSeleccionados" :listaAreasAsignaturas="listaAreasAsignaturas" :listaDescriptores="listaDescriptores" :notas="notas" :datosEstudiantes="datosEstudiantes" :anio="Number(aLectivo)" :periodoActual="idPeriodo" :periodosVisibles="periodosVisibles" :nombreSede="nombreSede" :nombreCurso="nombreCurso" :nombrePeriodo="nombrePeriodo" :nombreJornada="nombreJornada" :nombreDirector="nombreDirector" :idNivel="idNivel" :umbralesA="umbralesA" :umbralesT="umbralesT" :pesosPeriodos="pesosPeriodos" :tipoValComp="tipoValComp" :promCompor="promCompor" :letrasCompor="letrasCompor" :firmasBoletin="firmasBoletin" :descC1="descC1" :descC2="descC2" :descC3="descC3" :idGrado="idGrado" />
        </span>
        <span v-else-if="idInstitucion == 'acaa36d0-fcb1-11ec-8267-536b07c743c4'"> <!-- EMILIANI -->
          <BoletinPeriodoEmiliani v-if="mostrarBoletines" :estudiantesSeleccionados="estudiantesSeleccionados" :listaAreasAsignaturas="listaAreasAsignaturas" :listaDescriptores="listaDescriptores" :notas="notas" :datosEstudiantes="datosEstudiantes" :anio="Number(aLectivo)" :periodoActual="idPeriodo" :periodosVisibles="periodosVisibles" :nombreSede="nombreSede" :nombreCurso="nombreCurso" :nombrePeriodo="nombrePeriodo" :nombreJornada="nombreJornada" :nombreDirector="nombreDirector" :idNivel="idNivel" :umbralesA="umbralesA" :umbralesT="umbralesT" :pesosPeriodos="pesosPeriodos" :tipoValComp="tipoValComp" :promCompor="promCompor" :letrasCompor="letrasCompor" :firmasBoletin="firmasBoletin" :descC1="descC1" :descC2="descC2" :descC3="descC3" :idGrado="idGrado" />
        </span>
        <span v-else>
          <BoletinPeriodo v-if="mostrarBoletines" :estudiantesSeleccionados="estudiantesSeleccionados" :listaAreasAsignaturas="listaAreasAsignaturas" :listaDescriptores="listaDescriptores" :notas="notas" :datosEstudiantes="datosEstudiantes" :anio="Number(aLectivo)" :periodoActual="idPeriodo" :periodosVisibles="periodosVisibles" :nombreSede="nombreSede" :nombreCurso="nombreCurso" :nombrePeriodo="nombrePeriodo" :nombreJornada="nombreJornada" :nombreDirector="nombreDirector" :idNivel="idNivel" :umbralesA="umbralesA" :umbralesT="umbralesT" :pesosPeriodos="pesosPeriodos" :tipoValComp="tipoValComp" :promCompor="promCompor" :letrasCompor="letrasCompor" :firmasBoletin="firmasBoletin" :descC1="descC1" :descC2="descC2" :descC3="descC3" />
        </span>
      </div>
    </div>
    <b-modal ref="modalFichaEstudiante" size="xl" scrollable hide-footer title="Ficha del Estudiante" ok-only>
      <div class="mx-3">
        <div>
          <FichaEstudiante :datosEstudiante="datosEstudiante" @retorno="datosRecibidosEstudiante"/>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalAsociarPapa" size="xl" scrollable hide-footer title="Ficha del Papá" ok-only>
      <div class="mx-3">
        <div>
          <FichaPapa :datosPapa="datosFichaP" @retorno="datosRecibidosPapa"/>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalAsociarMama" size="xl" scrollable hide-footer title="Ficha de la Mamá" ok-only>
      <div class="mx-3">
        <div>
          <FichaMama :datosMama="datosFichaM" @retorno="datosRecibidosMama"/>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalAsociarAcudiente" size="xl" scrollable hide-footer title="Ficha del Acudiente" ok-only>
      <div class="mx-3">
        <div>
          <FichaAcudiente :datosAcudiente="datosFichaA" @retorno="datosRecibidosAcudiente"/>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";
  import BoletinPeriodo from '@/views/BoletinPeriodo'
  import BoletinPeriodoInem from '@/views/BoletinPeriodoInem'
  import BoletinPeriodoGranColombiano from '@/views/BoletinPeriodoGranColombiano'
  import BoletinPeriodoGustavoRojas from '@/views/BoletinPeriodoGustavoRojas'
  import BoletinPeriodoJulius from '@/views/BoletinPeriodoJulius'
  import BoletinPeriodoEmiliani from '@/views/BoletinPeriodoEmiliani'
  import BoletinPree from '@/views/BoletinPree'
  import FichaEstudiante from '@/views/FichaEstudiante'
  import FichaPapa from '@/views/FichaPapa'
  import FichaMama from '@/views/FichaMama'
  import FichaAcudiente from '@/views/FichaAcudiente'

  export default {
    name: 'Inicio',
    mixins: [validationMixin],
    components: {
      BoletinPeriodoInem,
      BoletinPeriodoGranColombiano,
      BoletinPeriodoGustavoRojas,
      BoletinPeriodoJulius,
      BoletinPeriodoEmiliani,
      BoletinPeriodo,
      BoletinPree,
      FichaEstudiante,
      FichaPapa,
      FichaMama,
      FichaAcudiente,
    },
    data () {
      return {
        idInstitucion: null,
        comboInstituciones: [],
        listaInstituciones: [],
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
        periodos: ['','PRIMERO','SEGUNDO','TERCERO','CUARTO'],
        nombreJornada: null,
        nombreDirector: null,
        coordinador: null,
        idNivel: null,
        idGrado: null,
        actFicha: 0,
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
        descC1: null,
        descC2: null,
        descC3: null,
        fechaConsulta: false,
        actualizarFicha: 0,
        consultaBoletin: 0,
        consultaObservador: 0,
        listaReportes: [],
        datosEstudiante: {},
        datosFichaP: {},
        datosFichaM: {},
        datosFichaA: {},
        buscarTexto: {
          textoBusqueda: null,
        },
        alcaldia: null,
        secretaria: null,
        encontrado: false,
        escudoIE: '',
        nombreIE: '',
        firmasBoletin: '',
        fichaE: false,
        fichaP: false,
        fichaM: false,
        fichaA: false,
        foto: CONFIG.FOTO,
      }
    },
    validations: {
      buscarTexto: {
        textoBusqueda: { required, minLength: minLength(0) }
      }
    },
    methods: {
      consultarObservador() {
        this.mensajeEmergente('info','Consultando observador del estudiante...')
      },
      async finalizarActualizacion() {
        this.actFicha = 0
        const actEstudiante = {idEstudiante: this.datosEstudiante.idEstudiante}
        await axios
        .put(CONFIG.ROOT_PATH + 'academico/estudiantes/actualizaciondatos', JSON.stringify(actEstudiante), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Estudiante')
          } else {
            this.mensajeEmergente('success',' La actualización de datos del Estudiante se realizó satisfactoriamente.')
            this.actFicha = 1
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Estudiante. Intente más tarde. ' + err)
        })
      },
      verFichaAcudiente() {
        this.datosFichaA.idEstudiante = this.datosEstudiante.idEstudiante
        this.datosFichaA.idAcudiente = this.datosEstudiante.id_acudiente
        this.datosFichaA.idParentesco = this.datosEstudiante.id_parentesco
        this.$refs['modalAsociarAcudiente'].show()
      },
      datosRecibidosAcudiente(retorno) {
        if(retorno != 0) {
          this.datosEstudiante.id_acudiente = retorno.idAcudiente
          this.datosEstudiante.id_parentesco = retorno.idParentesco
          this.fichaA = true
          this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los datos del Acudiente se han actualizado correctamente.')
        }
        this.$refs['modalAsociarAcudiente'].hide()
      },
      verFichaMama() {
        this.datosFichaM.idEstudiante = this.datosEstudiante.idEstudiante
        this.datosFichaM.idMama = this.datosEstudiante.id_mama
        this.$refs['modalAsociarMama'].show()
      },
      datosRecibidosMama(retorno) {
        if(retorno != 0) {
          this.datosEstudiante.id_mama = retorno
          this.fichaM = true
          this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los datos de la Mamá se han actualizado correctamente.')
        }
        this.$refs['modalAsociarMama'].hide()
      },
      verFichaPapa() {
        this.datosFichaP.idEstudiante = this.datosEstudiante.idEstudiante
        this.datosFichaP.idPapa = this.datosEstudiante.id_papa
        this.$refs['modalAsociarPapa'].show()
      },
      datosRecibidosPapa(retorno) {
        if(retorno != 0) {
          this.datosEstudiante.id_papa = retorno
          this.fichaP = true
          this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los datos del Papá se han actualizado correctamente.')
        }
        this.$refs['modalAsociarPapa'].hide()
      },
      verFichaEstudiante() {
        //this.datosEstudiante.idEstudiante = this.datosEstudiante.idEstudiante
        this.$refs['modalFichaEstudiante'].show()
      },
      datosRecibidosEstudiante(retorno) {
        if(retorno == 1) {
          this.fichaE = true
          this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los datos del Estudiante se han actualizado correctamente.')
        }
        this.$refs['modalFichaEstudiante'].hide()
      },
      async imprimirReportes() {
        this.btnCargando = true
        this.listaReportes = []
        let puesto = ''
        if (this.idNivel == 99) {
          this.listaReportes = []
          let nomPeriodo = ''
          if (this.idPeriodo == 1) nomPeriodo = 'PRIMERO'
          if (this.idPeriodo == 2) nomPeriodo = 'SEGUNDO'
          if (this.idPeriodo == 3) nomPeriodo = 'TERCERO'
          if (this.idPeriodo == 4) nomPeriodo = 'CUARTO'
          this.listaReportes.push({ 'id': this.datosEstudiante.idMatricula, 'estudiante': this.datosEstudiante.nombre, 'pue': '', 'pro': '' })
          let uri = "?datos=" + JSON.stringify(this.listaReportes) + "&ie=" + this.datosEstudiante.institucion + "&vigencia=" + "2025" + "&escudo=" + this.datosEstudiante.escudo + "&sede=" + this.datosEstudiante.sede + "&idCurso=" + this.datosEstudiante.idCurso + "&curso=" + this.datosEstudiante.curso + "&jornada=" + this.datosEstudiante.jornada + "&director=" + this.datosEstudiante.director + "&periodo=" + nomPeriodo + "&idPeriodo=" + this.idPeriodo + "&idIe=" + this.datosEstudiante.idInstitucion + "&idNivel=" + this.datosEstudiante.idNivel + "&puesto=" + "" +
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
          this.descC1 = this.datosEstudiante.nombreC1 != '' && this.datosEstudiante.nombreC1 != null ? this.datosEstudiante.nombreC1.substr(0,3) : 'C1'
          this.descC2 = this.datosEstudiante.nombreC2 != '' && this.datosEstudiante.nombreC2 != null ? this.datosEstudiante.nombreC2.substr(0,3) : 'C2'
          this.descC3 = this.datosEstudiante.nombreC3 != '' && this.datosEstudiante.nombreC3 != null ? this.datosEstudiante.nombreC3.substr(0,3) : 'C3'
          this.letrasCompor = [this.datosEstudiante.compL1,this.datosEstudiante.compL2,this.datosEstudiante.compL3,this.datosEstudiante.compL4]
          this.firmasBoletin = ''
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
          this.nombrePeriodo = this.periodos[this.idPeriodo]
          this.datosEstudiantes = []
          await axios
          .get(CONFIG.ROOT_PATH + 'boletines/listacurso/boletines', { params: { idCurso: this.idCurso, vigencia: this.aLectivo }})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consulta Lista Curso')
              this.btnCargando = false
            } else{
              if (response.data.datos != 0) {
                this.datosEstudiantes = response.data.datos
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
        .get(CONFIG.ROOT_PATH + 'boletines/notas/curso/periodo', {params: {idCurso: this.idCurso, periodo: this.idPeriodo, vigencia: this.aLectivo}})
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
      configuracionIE() {
        this.fechaConsulta = false
        if (this.idInstitucion != null) {
          this.listaInstituciones.forEach(element => {
            if (element.idInstitucion == this.idInstitucion) {
              this.idPeriodo = element.periodo_consulta
              this.aLectivo = element.aLectivo
              this.fechaIniConsulta = element.fechaIniConsulta
              this.fechaFinConsulta = element.fechaFinConsulta
              this.actualizarFicha = element.actualizarFicha
              this.consultaBoletin = element.consultaBoletin
              this.consultaObservador = element.consultaObservador
              this.$store.commit('set', ['nombreInstitucion', element.institucion])
              this.$store.commit('set', ['escudoInstitucion', element.escudo])
              this.$store.commit('set', ['daneInstitucion', element.dane])
              this.$store.commit('set', ['idSeccion', 1])
              const fechaHoy = new Date()
              const fechaIni = new Date(this.fechaIniConsulta)
              const fechaFin = new Date(this.fechaFinConsulta)
              //console.log('Hoy' + fechaHoy.getTime())
              //console.log('Ini' + fechaIni.getTime())
              //console.log('Fin' + fechaFin.getTime())
              if((fechaHoy > fechaIni && fechaHoy < fechaFin) ? 1 : 0) {
                this.fechaConsulta = true
              }
            }
          })
        }
      },
      async consultarInstituciones() {
        this.btnCargando = true
        this.listaInstituciones = []
        this.comboInstituciones = []
        await axios
        .get(CONFIG.ROOT_PATH + 'academico/lista/instituciones/acudiente')
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Lista instituciones')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.listaInstituciones = response.data.datos
              this.listaInstituciones.forEach(element => {
                this.comboInstituciones.push({ 'value': element.idInstitucion, 'text': element.institucion.toUpperCase() })
              })
              //console.log(JSON.stringify(this.listaInstituciones))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Lista instituciones. Intente más tarde.' + err)
          this.btnCargando = false
        })
      },
      async buscarEstudiante() {
        this.fichaE = false
        this.fichaP = false
        this.fichaM = false
        this.fichaA = false
        this.datosEstudiante = {}
        this.encontrado = false
        this.$v.buscarTexto.$touch()
        if (this.$v.buscarTexto.$anyError) {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La consulta esta vacia.')
          this.$refs.texto.focus()
          return false
        } else {
          await axios
          .get(CONFIG.ROOT_PATH + 'academico/buscarestudiante/documento/reporte', { params: { texto: this.buscarTexto.textoBusqueda, idInstitucion: this.idInstitucion }})
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
                this.actFicha = this.datosEstudiante.actFicha
                this.consultarEstudiantes()
                this.$store.commit('set', ['datosSecciones', [{
                  minBaj: this.datosEstudiante.minBaj,
                  maxBaj: this.datosEstudiante.maxBaj,
                  minBas: this.datosEstudiante.minBas,
                  maxBas: this.datosEstudiante.maxBas,
                  minAlt: this.datosEstudiante.minAlt,
                  maxAlt: this.datosEstudiante.maxAlt,
                  minSup: this.datosEstudiante.minSup,
                  maxSup: this.datosEstudiante.maxSup
                }]])
                //console.log(JSON.stringify(this.datosEstudiante))
              } else {
                this.mensajeEmergente('info',CONFIG.TITULO_MSG,'El estudiante no se encuentra matriculado en la Institución Educativa.')
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
      this.consultarInstituciones()
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
