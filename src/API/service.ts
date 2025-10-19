import { LoginData, PropertyMaster } from '../Models/models';

import apiClient from './ApiClient';


export const loginUser = (loginPayload: LoginData) => {
    return apiClient.post(`/Auth/login`, loginPayload);
}


export const updatePropertyMaster = async (payload: PropertyMaster) => {
    const payloadToApi = {
        "propertyId": payload.propertyId || null,
        "ownerId": payload.ownerId || null,
        "householdNo": payload.householdNo,
        "zone": payload.zone || null,
        "ward": payload.ward || null,
        "wardName": payload.wardName || null,
        "propertyType": payload.propertyType || null,
        "typeOfOwnership": payload.typeOfOwnership || null,
        "otherTypeOfOwnerShip": payload.otherTypeOfOwnerShip || null,
        "widthOfRoad": payload.widthOfRoad || null,
        "areaOfPlot": payload.areaOfPlot || null,
        "noOfFloors": payload.noOfFloors || null,
        "floorWiseDataId": payload.floorWiseDataId || null,
        "buildingNo": payload.buildingNo || null,
        "flatNo": payload.flatNo || null,
        "flatSize": payload.flatSize || null,
        "elctricityCustomerId": payload.elctricityCustomerId || null,
        "electricityAccountNo": payload.electricityAccountNo || null,
        "electricityBookNo": payload.electricityBookNo || null,
        "electricityCategory": payload.electricityCategory || null,
        "buildingPlanApprovalNo": payload.buildingPlanApprovalNo || null,
        "buildingPlanApprovalDate": payload.buildingPlanApprovalDate || null,
        "waterConsumerNo": payload.waterConsumerNo || null,
        "waterConnectionDate": payload.waterConnectionDate || null,
        "district": payload.district || null,
        "tahasil": payload.tahasil || null,
        "villageName": payload.villageName || null,
        "khataNo": payload.khataNo || null,
        "plotNo": payload.plotNo || null,
        "propertyAddress": payload.propertyAddress || null,
        "propertyAddressDistrict": payload.propertyAddressDistrict || null,
        "propertyAddressCity": payload.propertyAddressCity || null,
        "propertyAddressPin": payload.propertyAddressPin || null,
        "latitude": payload.latitude || null,
        "longitude": payload.longitude || null,
        "isOwnerAddressSame": payload.isOwnerAddressSame || null,
        "ownerAddress": payload.ownerAddress || null,
        "ownerAddressDistrict": payload.ownerAddressDistrict || null,
        "ownerAddressCity": payload.ownerAddressCity || null,
        "ownerAddressPin": payload.ownerAddressPin || null,
        "plotArea": payload.plotArea || null,
        "dateOfAcquisition": payload.dateOfAcquisition || null,
        "useAsPerMasterPlan": payload.useAsPerMasterPlan || null,
        "mobileTowerArea": payload.mobileTowerArea || null,
        "mobileTowerDateOfInstallation": payload.mobileTowerDateOfInstallation || null,
        "hoardingArea": payload.hoardingArea || null,
        "hoardingDateOfInstallation": payload.hoardingDateOfInstallation || null,
        "petrolpumpUndergroundArea": payload.petrolpumpUndergroundArea || null,
        "petrolpumpDateOfCompletion": payload.petrolpumpDateOfCompletion || null,
        "hasWaterHarvestingProvision": payload.hasWaterHarvestingProvision || null,
        "attribute0": payload.attribute0 || null,
        "attribute1": payload.attribute1 || null,
        "attribute2": payload.attribute2 || null,
        "attribute3": payload.attribute3 || null,
        "attribute4": payload.attribute4 || null,
        "attribute5": payload.attribute5 || null,
        "attribute6": payload.attribute6 || null,
        "attribute7": payload.attribute7 || null,
        "attribute8": payload.attribute8 || null,
        "attribute9": payload.attribute9 || null,
        "mohallaName": payload.mohallaName || null,
        "ownerName": payload.ownerName || null,
        "amount": payload.amount || null,
        "category": payload.category || null,
        "subcategory": payload.subcategory || null,
        "rate": payload.rate || null,
        "createdBy": null,
        "createdOn": null,
        "updatedBy": null,
        "updatedOn": null,
        "status": payload.status || null,
        "salutaion": payload.salutaion || null,
        "careOf": payload.careOf || null,
        "guardianName": payload.guardianName || null,
        "gender": payload.gender || null,
        "dob": payload.dob || null,
        "mobile": payload.mobile || null,
        "email": payload.email || null,
        "pan": payload.pan || null,
        "aadhar": payload.aadhar || null,
        "isSpecialOwner": payload.isSpecialOwner || null,
        "identityProof": payload.identityProof || null,
        "photo": payload.photo || null,
        "specialCertificate": payload.specialCertificate || null
    }
    console.log(payloadToApi)

    return apiClient.post(`/Master/AddOrUpdatePropertyMaster`, payloadToApi);
}

export const getPropertyMasterDetail = async (pin: string) => {
    return apiClient.get(`/Master/getPropertyMasterDetails?propertyNumber=${pin}`)
}

export const getOwnerDetails = async (ownerId: number) => {
    return apiClient.get(`/Master/ownerDetails?ownerId=${ownerId}`)
}
