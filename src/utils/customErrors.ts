class GetAllError extends Error {
    constructor(message: string, componentName?: string){
        super(message)
        this.name = `${componentName}GetAllError`
    }
}

class GetByIdError extends Error {
    constructor(message: string, componentName?: string){
        super(message)
        this.name = `${componentName}GetByIdError`
    }
}

class CreationError extends Error {
    constructor(message: string, componentName?: string){
        super(message)
        this.name = `${componentName}CreationError`
    }
}

class UpdateError extends Error {
    constructor(message: string, componentName?: string){
        super(message)
        this.name = `${componentName}UpdateError`
    }
}

class DeleteError extends Error {
    constructor(message: string, componentName?: string){
        super(message)
        this.name = `${componentName}DeleteError`
    }
}

class NotFoundError extends Error {
    constructor(message:string){
        super(message)
        this.name = "NotFound"
    }
}

export {
    GetAllError,
    GetByIdError,
    CreationError,
    UpdateError,
    DeleteError,
    NotFoundError
}