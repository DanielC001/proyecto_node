import { db } from "../../../config/database"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import logger from '../../../utils/logger'
import { GetAllError,CreationError, UpdateError, DeleteError, GetByIdError} from "../../../utils/customErrors"

export class AppointmentRepository {
    public async createAppointment(appointment: AppointmentReq): Promise<AppointmentResDB> {
        try {
            const objReq = {...appointment,created_at: new Date,updated_at: new Date()}
            const [createdAppointment] =  await db('citas').insert(objReq).returning('*') 
            return createdAppointment
        } catch (error) {
            throw new CreationError(`Failed to create appointment : ${error}`,'appointment')
        }
    }

    public async getAllAppointment(): Promise<Appointment[]> {
        try {
            return  db.select('*').from('citas')
        } catch (error) {
            throw new GetAllError("Failed getting all appointments from repository", "appointment")
        }
    }

    public async getAppointmentById(id: number): Promise<AppointmentResDB> {
        try{
            const appointment = await db('citas').where({ id_cita: id }).first()
            return appointment
        } catch (error){
            logger.error( 'Failed get appointment by id in repository', {error})
            throw new GetByIdError('Failed get appointment by id in repository')
        }
    }
    
    public async updateAppointment(id: number, updates: Partial<AppointmentReq>): Promise<void> {
        try{
            const appoUpdate = {...updates,updated_at: new Date()}
            await db('citas').where({ id_cita: id }).update(appoUpdate)
        } catch (error){
            logger.error( 'Failed updated appointment in repository', {error})
            throw new UpdateError('Failed updated appointment in repository','appointment');
        }
    }

    public async deleteAppointment(id: number): Promise<void> {
        try{
            await db('citas').where({ id_cita: id }).del()
        } catch (error){
            logger.error( 'Failed deleting appointment in repository', {error})
            throw new DeleteError('Failed deleting appointment in repository','appointment') 
        }
    }
}