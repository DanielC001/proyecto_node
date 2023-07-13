import { Patient, PatientReq } from "../api/components/pacientes/model";
import { PatientRepository } from "../api/components/pacientes/repository";
import { PatientServiceImpl } from "../api/components/pacientes/service";

describe('PatientService', () =>{
    let patientService:PatientServiceImpl;
    let patientRepository:PatientRepository;

    beforeEach(()=>{
        patientRepository = {
            getAllPatients: jest.fn(),
            createPatient: jest.fn(),
            getPatientById: jest.fn(),
            updatePatient: jest.fn(),
            deletePatient: jest.fn()
        }

        patientService = new PatientServiceImpl(patientRepository);
    });

    describe('getAllPatients',()=>{
        it('should get all patients from service', async ()=>{

            const fecha = new Date();
            //Mock
            const patients : Patient[] = [
                {id_paciente: 1,nombre: "pepito",apellido: "perez",identificacion: "0001",telefono: 12345,createdAt: fecha,updatedAt: fecha}
            ];
            
            (patientRepository.getAllPatients as jest.Mock).mockReturnValue(patients)

            // Method execution
            const result  = await patientService.getAllPatients();

            // Asserts
            expect(patientRepository.getAllPatients).toHaveBeenCalled()
            expect(result).toEqual(patients)
        });

        it('should return an empty array when no patients are found', async () => {
            // Mock Process
            (patientRepository.getAllPatients as jest.Mock).mockResolvedValue([])

            // Method execution
            const result = await patientService.getAllPatients()

            // Asserts
            expect(patientRepository.getAllPatients).toHaveBeenCalled();
            expect(result).toEqual([]);
        })
    });

    describe('createPatient', () => {
        it('should create a new patient and return it from  service', async () => {
            // Mock Process
            const fecha = new Date();
            const patientRes: Patient = {id_paciente: 1,nombre: "pepito",apellido: "perez",identificacion: "0001",telefono: 12345,createdAt: fecha,updatedAt: fecha};
            const patientReq: PatientReq = {nombre:"pepito", apellido:"perez", identificacion:"0001",telefono:12345};
            
            (patientRepository.createPatient as jest.Mock).mockResolvedValue(patientRes);

            // Method execution
            const result  = await patientService.createPatient(patientReq)

            // Asserts
            expect(patientRepository.createPatient).toHaveBeenCalledWith(patientReq)
            expect(result).toEqual(patientRes)
        })

        it('should throw and error if patient creation fails', async () => {
            // Mock Process
            const patientReq: PatientReq = {nombre:"pepito", apellido:"perez", identificacion:"0001",telefono:12345};
            const error = new Error('Failed to create patient');
            (patientRepository.createPatient as jest.Mock).mockRejectedValue(error)

            await expect(patientService.createPatient(patientReq)).rejects.toThrowError(error)
            expect(patientRepository.createPatient).toHaveBeenCalledWith(patientReq)
        })
    })

    describe('getPatientById', () => {
        it('should get patient by id from service', async () => {
            // Mock Process
            const fecha = new Date();
            const patient : Patient = {id_paciente: 1,nombre: "pepito",apellido: "perez",identificacion: "0001",telefono: 12345,createdAt: fecha,updatedAt: fecha}
            const patientId = 1;

            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(patient)

            // Method execution
            const result = await patientService.getPatientById(patientId)

            // Asserts
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(patientId)
            expect(result).toEqual(patient)
        })
        it('should return an empty array when no patient are found', async () => {
            // Mock Process
            const patientId = 1;
            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(null)

            // Method execution
            const result  = await patientService.getPatientById(patientId)

            // Asserts
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(patientId)
            expect(result).toBeNull()
        })
        it('should throw an error if retrieval fails', async () => {
            // Mock Process
            const patientId = 1
            const error = new Error('Database error');
            (patientRepository.getPatientById as jest.Mock).mockRejectedValue(error)

            // Asserts
            await expect(patientService.getPatientById(patientId)).rejects.toThrowError(error)
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(patientId) 
        })
    })
});