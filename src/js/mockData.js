/* ================================================================
   mockData.js — Datos de prueba compartidos (Mock Backend)
   Simula la base de datos del sistema EduSystem IPN.
   En producción: reemplazar con llamadas fetch() al API REST.
   ================================================================ */

/**
 * MODELO: Estudiante
 * @typedef {Object} Alumno
 * @property {number}  id
 * @property {string}  nombre
 * @property {string}  boleta
 * @property {string}  email
 * @property {string}  curso        - clave del curso
 * @property {string}  cursoNombre
 * @property {number}  progreso     - 0–100
 * @property {number}  puntaje
 * @property {string}  estado       - 'active' | 'pending'
 * @property {number}  completados
 * @property {number}  pendientes
 */

/** @type {Alumno[]} */
const DB_ALUMNOS = [
    { id:1, nombre:'Ana García López',     boleta:'2021600001', email:'agarcia@ipn.mx',   curso:'mat', cursoNombre:'Matemáticas Avanzadas', progreso:78, puntaje:920, estado:'active', completados:7, pendientes:1 },
    { id:2, nombre:'Carlos Morales Pérez', boleta:'2021600002', email:'cmorales@ipn.mx',  curso:'fis', cursoNombre:'Física General II',     progreso:55, puntaje:640, estado:'pending',completados:4, pendientes:3 },
    { id:3, nombre:'Valeria Ruiz Torres',  boleta:'2021600003', email:'vruiz@ipn.mx',     curso:'mat', cursoNombre:'Matemáticas Avanzadas', progreso:91, puntaje:1100,estado:'active', completados:9, pendientes:0 },
    { id:4, nombre:'Diego López Vega',     boleta:'2021600004', email:'dlopez@ipn.mx',    curso:'prog',cursoNombre:'Programación I',        progreso:40, puntaje:480, estado:'pending',completados:3, pendientes:4 },
    { id:5, nombre:'Sofía Hernández Díaz', boleta:'2021600005', email:'shernandez@ipn.mx',curso:'fis', cursoNombre:'Física General II',     progreso:65, puntaje:750, estado:'active', completados:5, pendientes:2 },
    { id:6, nombre:'Luis Martínez Cruz',   boleta:'2021600006', email:'lmartinez@ipn.mx', curso:'mat', cursoNombre:'Matemáticas Avanzadas', progreso:30, puntaje:310, estado:'pending',completados:2, pendientes:5 },
    { id:7, nombre:'Fernanda Reyes Mora',  boleta:'2021600007', email:'freyes@ipn.mx',    curso:'prog',cursoNombre:'Programación I',        progreso:83, puntaje:980, estado:'active', completados:8, pendientes:1 },
    { id:8, nombre:'Marco Antonio Soto',   boleta:'2021600008', email:'msoto@ipn.mx',     curso:'fis', cursoNombre:'Física General II',     progreso:70, puntaje:820, estado:'active', completados:6, pendientes:2 },
    { id:9, nombre:'Paola Jiménez Núñez',  boleta:'2021600009', email:'pjimenez@ipn.mx',  curso:'mat', cursoNombre:'Matemáticas Avanzadas', progreso:50, puntaje:590, estado:'pending',completados:4, pendientes:3 },
    { id:10,nombre:'Roberto Castillo Gil', boleta:'2021600010', email:'rcastillo@ipn.mx', curso:'prog',cursoNombre:'Programación I',        progreso:95, puntaje:1150,estado:'active', completados:10,pendientes:0 },
];

/**
 * MODELO: Desafío
 * @typedef {Object} Desafio
 */
const DB_DESAFIOS = [
    { id:'D1', titulo:'Derivadas e integrales',    materia:'Matemáticas Avanzadas', estado:'open',   fechaLimite:'2025-06-10', puntos:150, totalEntregas:18 },
    { id:'D2', titulo:'Leyes de Newton',            materia:'Física General II',     estado:'open',   fechaLimite:'2025-06-12', puntos:200, totalEntregas:22 },
    { id:'D3', titulo:'Álgebra lineal: matrices',   materia:'Matemáticas Avanzadas', estado:'closed', fechaLimite:'2025-05-28', puntos:120, totalEntregas:30 },
];

/**
 * MODELO: Entrega de alumno a un desafío
 */
const DB_ENTREGAS = {
    'D1': [
        { alumnoId:1,  alumnoNombre:'Ana García López',     fecha:'2025-06-05', calificacion:95,  estado:'graded',  codigo:`public class Derivadas {\n  public static double derivar(double x) {\n    // Derivada de x^2\n    return 2 * x;\n  }\n  public static void main(String[] args) {\n    System.out.println(derivar(3)); // → 6.0\n  }\n}` },
        { alumnoId:2,  alumnoNombre:'Carlos Morales Pérez', fecha:'2025-06-06', calificacion:null, estado:'pending', codigo:`public class Derivadas {\n  // TODO: implementar derivada\n  public static double derivar(double x) {\n    return 0;\n  }\n}` },
        { alumnoId:5,  alumnoNombre:'Sofía Hernández Díaz', fecha:'2025-06-04', calificacion:88,  estado:'graded',  codigo:`public class Derivadas {\n  public static double derivar(double[] coef) {\n    double resultado = 0;\n    for (int i = 1; i < coef.length; i++) {\n      resultado += i * coef[i];\n    }\n    return resultado;\n  }\n}` },
        { alumnoId:6,  alumnoNombre:'Luis Martínez Cruz',   fecha:'2025-06-07', calificacion:null, estado:'pending', codigo:`// Entrega parcial\npublic class Derivadas {\n  public double calcular(double x) {\n    return x * x;\n  }\n}` },
    ],
    'D2': [
        { alumnoId:2,  alumnoNombre:'Carlos Morales Pérez', fecha:'2025-06-03', calificacion:72,  estado:'graded',  codigo:`public class Newton {\n  // F = m * a\n  public static double segundaLey(double masa, double aceleracion) {\n    return masa * aceleracion;\n  }\n}` },
        { alumnoId:5,  alumnoNombre:'Sofía Hernández Díaz', fecha:'2025-06-04', calificacion:null, estado:'pending', codigo:`public class Newton {\n  // TODO: implementar las 3 leyes\n}` },
        { alumnoId:8,  alumnoNombre:'Marco Antonio Soto',   fecha:'2025-06-02', calificacion:91,  estado:'graded',  codigo:`public class Newton {\n  static double primeraLey(double v0, double f) {\n    return (f == 0) ? v0 : v0 + f;\n  }\n  static double segundaLey(double m, double a) { return m * a; }\n  static double terceraLey(double f) { return -f; }\n}` },
    ],
    'D3': [
        { alumnoId:1,  alumnoNombre:'Ana García López',     fecha:'2025-05-25', calificacion:100, estado:'graded',  codigo:`public class Matrices {\n  public static int[][] multiplicar(int[][] A, int[][] B) {\n    int n = A.length;\n    int[][] C = new int[n][n];\n    for (int i=0;i<n;i++)\n      for (int j=0;j<n;j++)\n        for (int k=0;k<n;k++)\n          C[i][j] += A[i][k] * B[k][j];\n    return C;\n  }\n}` },
        { alumnoId:3,  alumnoNombre:'Valeria Ruiz Torres',  fecha:'2025-05-24', calificacion:98,  estado:'graded',  codigo:`public class Matrices {\n  // Determinante 2x2\n  public static double det(double[][] m) {\n    return m[0][0]*m[1][1] - m[0][1]*m[1][0];\n  }\n}` },
        { alumnoId:9,  alumnoNombre:'Paola Jiménez Núñez',  fecha:'2025-05-26', calificacion:76,  estado:'graded',  codigo:`public class Matrices {\n  int[][] transponer(int[][] A) {\n    int[][] T = new int[A[0].length][A.length];\n    for(int i=0;i<A.length;i++)\n      for(int j=0;j<A[0].length;j++)\n        T[j][i] = A[i][j];\n    return T;\n  }\n}` },
    ]
};

/**
 * MODELO: Desafíos del estudiante (para HU-11)
 */
const DB_DESAFIOS_ESTUDIANTE = [
    { id:'DE1', titulo:'Derivadas e integrales',    materia:'Matemáticas Avanzadas', fechaLimite:'2025-06-10', puntaje:95,  estado:'complete', diasRestantes:null },
    { id:'DE2', titulo:'Leyes de Newton',            materia:'Física General II',     fechaLimite:'2025-06-12', puntaje:null,estado:'pending',  diasRestantes:3 },
    { id:'DE3', titulo:'Álgebra lineal: matrices',   materia:'Matemáticas Avanzadas', fechaLimite:'2025-05-28', puntaje:100, estado:'complete', diasRestantes:null },
    { id:'DE4', titulo:'Cinemática',                 materia:'Física General II',     fechaLimite:'2025-06-18', puntaje:null,estado:'pending',  diasRestantes:9 },
    { id:'DE5', titulo:'Cálculo diferencial',        materia:'Matemáticas Avanzadas', fechaLimite:'2025-05-15', puntaje:88,  estado:'complete', diasRestantes:null },
    { id:'DE6', titulo:'Dinámica de fluidos',         materia:'Física General II',     fechaLimite:'2025-06-05', puntaje:null,estado:'overdue',  diasRestantes:-1 },
    { id:'DE7', titulo:'Transformaciones lineales',  materia:'Matemáticas Avanzadas', fechaLimite:'2025-05-30', puntaje:92,  estado:'complete', diasRestantes:null },
    { id:'DE8', titulo:'Circuitos eléctricos',       materia:'Física General II',     fechaLimite:'2025-06-20', puntaje:null,estado:'pending',  diasRestantes:11 },
    { id:'DE9', titulo:'Espacios vectoriales',        materia:'Matemáticas Avanzadas', fechaLimite:'2025-05-20', puntaje:79,  estado:'complete', diasRestantes:null },
    { id:'DE10',titulo:'Termodinámica básica',        materia:'Física General II',     fechaLimite:'2025-05-10', puntaje:85,  estado:'complete', diasRestantes:null },
    { id:'DE11',titulo:'Series de Taylor',            materia:'Matemáticas Avanzadas', fechaLimite:'2025-04-25', puntaje:91,  estado:'complete', diasRestantes:null },
];

/**
 * MODELO: Materias para progreso (HU-11)
 */
const DB_MATERIAS = [
    { nombre:'Matemáticas Avanzadas', profesor:'Prof. Ramírez', progreso:78, completados:6, total:8,  color:'purple' },
    { nombre:'Física General II',     profesor:'Prof. Torres',  progreso:57, completados:3, total:6,  color:'teal' },
];

/**
 * Base de datos en memoria — actúa como repositorio central.
 * Los controladores leen y escriben aquí.
 */
const AppDB = {
    alumnos:            [...DB_ALUMNOS],
    desafios:           [...DB_DESAFIOS],
    entregas:           { ...DB_ENTREGAS },
    desafiosEstudiante: [...DB_DESAFIOS_ESTUDIANTE],
    materias:           [...DB_MATERIAS],

    /** Iniciales de un nombre completo */
    initials(nombre) {
        return nombre.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
    },

    /** Formatear fecha YYYY-MM-DD a dd/mm/aaaa */
    formatDate(iso) {
        if (!iso) return '—';
        const [y,m,d] = iso.split('-');
        return `${d}/${m}/${y}`;
    },

    /** Color de progreso según porcentaje */
    progressColor(pct) {
        if (pct >= 75) return 'var(--green-600)';
        if (pct >= 50) return 'var(--amber-400)';
        return 'var(--red-600)';
    }
};