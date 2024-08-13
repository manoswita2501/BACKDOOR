// CONTROLLER :: VANDORCONTROLLER 
import { Request, Response, NextFunction } from "express";
import { VandorLoginInputs } from "../dto/Vandor.dto";
import { FindVandor } from "./AdminController";
import { ValidatePassword, GenerateSignature } from "../utility";
import { EditVandorInputs } from "../dto/Vandor.dto";

// VANDOR :: LOGIN FUNCTION 
export const VandorLogin = async(req:Request, res:Response, next:NextFunction) => {
    // CAPTURING LOGIN DATA
    const { email, password } = <VandorLoginInputs> req.body;
    const existingVandor = await FindVandor('', email);

    if (existingVandor !== null) {
        // VANDOR VALIDATION AND ACCESS PERMISSION FOR THE VANDOR 
        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt);
        if ( validation ) {
            const signature = GenerateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodType: existingVandor.foodType,
                name: existingVandor.name
            })
            return res.json(signature);
        } else {
            return res.json({"message" : "THE PASSWORD IS NOT VALID!"});
        }
    }
    return res.json({"message" : "LOGIN CREDENTIALS ARE NOT VALID!"})
} 

// VANDOR :: GET PROFILE 
export const GetVandorProfile = async(req:Request, res:Response, next:NextFunction) => {
    // STORING THE USER PAYLOAD FOR AUTHENTICATION 
    const user = req.user;
    if( user ) {
        const existingVandor = await FindVandor(user._id);
        return res.json(existingVandor);
    }

    return res.json({'message': 'VANDOR INFORMATION IS NOT FOUND!'})
}


// VANDOR :: UPDATE PROFILE 
export const UpdateVandorProfile = async(req:Request, res:Response, next:NextFunction) => {
    const user = req.user;

    const { foodType, name, address, phone } = <EditVandorInputs>req.body;

    if(user){
        const existingVandor = await FindVandor(user._id);
        
        if( existingVandor !== null ) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodType;

            const saveResult = await existingVandor.save();
            return res.json(saveResult);
        }
        return res.json({'message': 'VANDOR NOT FOUND!'});
    }
    return res.json({'message': 'UNABLE TO UPDATE THE VANDOR PROFILE!'});
}

// VANDOR :: UPDATE SERVICE 
export const UpdateVandorService = async(req:Request, res:Response, next:NextFunction) => {
    
}