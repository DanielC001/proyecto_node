import { db } from "../../../config/database"
import { Patient, PatientReq,  } from "./model"
import logger from '../../../utils/logger'
import { CreationError, DeleteError,GetAllError,  GetByIdError, UpdateError } from "../../../utils/customErrors"

export class PatientRepository {
    public async createPatient(patient: PatientReq): Promise<Patient> {
        try {
            const [createdPatient] =  await db('pacientes').insert(patient).returning('*') 
            return createdPatient
        } catch (error) {
            throw new CreationError("Failed to create patient","patient")
        }
    }

    public async getAllPatients(): Promise<Patient[]> {
        try {
            return  db.select('*').from('pacientes')
        } catch (error) {
            throw new GetAllError("Failed getting patients","patient")
        }
    }

    public async getPatientById(id: number): Promise<Patient> {
        try{
            const patient = await db('pacientes').where({ id_paciente: id }).first()
            return patient
        } catch (error){
            logger.error( 'Failed get patient by id in repository', {error})
            throw new GetByIdError("Failed get patient by id in repository","patient")
        }
    }

    public async updatePatient(id: number, updates: Partial<PatientReq>): Promise<void> {
        try{
            await db('pacientes').where({ id_paciente: id }).update(updates)
        } catch (error){
            logger.error( 'Failed updated patient in repository', {error})
            throw new UpdateError("Failed updated patient in repository","patient")
        }
    }

    public async deletePatient(id: number): Promise<void> {
        try{
            await db('pacientes').where({ id_paciente: id }).del()
        } catch (error){
            logger.error( 'Failed deleting patient in repository', {error})
            throw new DeleteError("Failed deleting patient in repository","patient")
        }
    }
}