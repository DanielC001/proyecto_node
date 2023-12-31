import { GetAllError, CreationError, UpdateError, DeleteError, GetByIdError, NotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { AppointmentReq, Appointment, AppointmentResDB } from "./model"
import { AppointmentRepository } from "./repository"
import { DoctorRepository } from "../doctores/repository"
import { Doctor } from "../doctores/model"

export interface AppointmentService {
    getAllAppointments(): Promise<Appointment[]>
    createAppointment(patientReq: AppointmentReq): Promise<Appointment>
    getAppointmentById(id: number): Promise<Appointment>
    updateAppointment(id: number, updates:Partial<Appointment>): Promise<AppointmentResDB>
    deleteAppointment(id: number): Promise<void>
}


export class AppointmentServiceImpl implements AppointmentService {
    private appointmentRepository: AppointmentRepository
    private doctorRepository: DoctorRepository

    constructor(appointmentRepository: AppointmentRepository, doctorRepository: DoctorRepository){
        this.appointmentRepository = appointmentRepository
        this.doctorRepository = doctorRepository
    }

    public async getAllAppointments(): Promise<Appointment[]> {
        try{
            const patients = await  this.appointmentRepository.getAllAppointment()
            return patients
        } catch (error){
            logger.error(error)
            throw new GetAllError("Failed getting all appointments from service", "appointment")
        }
    }
    
    public  async createAppointment(appointmentReq: AppointmentReq): Promise<Appointment> {
        try{
            const existDoctor = await this.doctorRepository.getDoctorById(appointmentReq.id_doctor);
            if(!existDoctor){
                throw new NotFoundError("doctor not found");
            }else{
                const appointmentDb = await this.appointmentRepository.createAppointment(appointmentReq) 
                const appointment: Appointment = mapAppointment(appointmentDb, existDoctor)
                return appointment
            }
        } catch (error){
            if(error instanceof NotFoundError){
                throw error;
            }else{
                throw new CreationError("Failed to create appointment from service","appointment");
            }
        }
    }

    public async getAppointmentById(id: number): Promise<Appointment> {
        try {
            const appointmentDb =  await this.appointmentRepository.getAppointmentById(id)
            const doctor = await this.doctorRepository.getDoctorById(appointmentDb.id_doctor)
            const appointment: Appointment = mapAppointment(appointmentDb, doctor)
            return appointment
        } catch (error) {
            logger.error('Failed to get appointment from service')
            throw new GetByIdError("Failed to get appointment from service","appointment")
        }
    }

    public  async updateAppointment(id: number, updates: Partial<AppointmentReq>): Promise<AppointmentResDB> {
        try {
            const existAppointment = await this.appointmentRepository.getAppointmentById(id)
            if (!existAppointment) {
                throw new GetByIdError("Failed to get appointment from service","appointment")
            }
            const updateAppointment = {...existAppointment, ...updates}
            this.appointmentRepository.updateAppointment(id,updateAppointment)
            return updateAppointment
        } catch (error) {
            logger.error('Failed to update appointment from service')
            throw new UpdateError("Failed to update appointment from service","appointment");
        }
    }

    public async deleteAppointment(id: number): Promise<void> {
        try {
            const existAppointment =  await this.appointmentRepository.getAppointmentById(id)

            if (!existAppointment) {
                throw new GetByIdError("Failed to get appointment from service","appointment")
            }
            await this.appointmentRepository.deleteAppointment(id)
        } catch (error) {
            logger.error('Failed to delete appointment from service')
            throw new DeleteError("Failed to delete appointment from service","appointment");
        }
    }
}


function mapAppointment(appointmentDb: AppointmentResDB, doctor: Doctor): Appointment {
    const appointment: Appointment = {
        identificacion_paciente: appointmentDb.identificacion_paciente, 
        especialidad:appointmentDb.especialidad,
        doctor: `${doctor.nombre} ${doctor.apellido}`,
        consultorio: doctor.consultorio,
        horario: appointmentDb.horario
    }
    return appointment
}