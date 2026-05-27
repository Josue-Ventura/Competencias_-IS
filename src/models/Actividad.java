package models;


import java.time.LocalDate;
import java.util.Objects;

public class Actividad {

    public enum Estado { PENDIENTE, COMPLETO }

    private final String id;
    private String titulo;
    private String descripcion;
    private LocalDate fechaLimite;

    private Estado estado;
    private double calificacion;        // -1 cuando aún no se ha calificado
    private String codigoEntregado;     // texto/código enviado por el alumno

    private final String idGrupo;
    private final String idAlumno;

    public Actividad(String id, String titulo, String descripcion,
                     LocalDate fechaLimite, String idGrupo, String idAlumno) {
        this.id = Objects.requireNonNull(id);
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaLimite = fechaLimite;
        this.idGrupo = idGrupo;
        this.idAlumno = idAlumno;
        this.estado = Estado.PENDIENTE;
        this.calificacion = -1;
        this.codigoEntregado = "";
    }
    public void registrarEntrega(String codigoFuente) {
        this.codigoEntregado = codigoFuente == null ? "" : codigoFuente;
    }

    public void asignarCalificacion(double nota) {
        if (nota < 0 || nota > 100) {
            throw new IllegalArgumentException("La calificación debe estar entre 0 y 100.");
        }
        this.calificacion = nota;
        this.estado = Estado.COMPLETO;
    }

    public boolean estaCompleta() { return estado == Estado.COMPLETO; }
    public boolean tieneEntrega() { return codigoEntregado != null && !codigoEntregado.isBlank(); }

    public String getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public LocalDate getFechaLimite() { return fechaLimite; }
    public Estado getEstado() { return estado; }
    public double getCalificacion() { return calificacion; }
    public String getCodigoEntregado() { return codigoEntregado; }
    public String getIdGrupo() { return idGrupo; }
    public String getIdAlumno() { return idAlumno; }

    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setFechaLimite(LocalDate fechaLimite) { this.fechaLimite = fechaLimite; }

    @Override
    public String toString() {
        String etiqueta = estaCompleta()
                ? String.format("[Completo · Nota: %.1f]", calificacion)
                : "[Pendiente]";
        return titulo + "   " + etiqueta;
    }
}
