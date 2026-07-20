from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

VerificationStatus = Literal["NOT_TESTED", "IN_TESTING", "VERIFIED", "REQUIRES_RETEST"]
PriceType = Literal["FIXED", "ESTIMATED", "STARTING_FROM", "CONTACT"]


class ContractModel(BaseModel):
    model_config = ConfigDict(extra="allow")


class DeliveryEstimate(ContractModel):
    min: int = Field(ge=0)
    max: int = Field(ge=0)


class DeliveryScope(ContractModel):
    code: str = Field(min_length=1)
    label: str = Field(min_length=1)
    enabled: bool
    estimatedDeliveryDays: DeliveryEstimate | None = None


class PreparationTime(ContractModel):
    min: int = Field(ge=1)
    max: int = Field(ge=1)
    unit: Literal["BUSINESS_DAY"]
    isAssumption: bool


class ProductVariant(ContractModel):
    id: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    label: str = Field(min_length=1)
    price: int | None = Field(default=None, ge=0)
    currency: Literal["VND"]
    priceType: PriceType
    unitsPerPackage: int = Field(ge=1)
    minimumQuantity: int = Field(ge=1)
    maximumQuantity: int = Field(ge=1)
    preparationTime: PreparationTime
    deliveryScopes: list[DeliveryScope]
    available: bool
    cancellationPolicyId: str = Field(min_length=1)

    @model_validator(mode="after")
    def validate_quantity_range(self) -> ProductVariant:
        if self.maximumQuantity < self.minimumQuantity:
            raise ValueError("maximumQuantity must be at least minimumQuantity")
        return self


class ResponseTime(ContractModel):
    min: int = Field(ge=1)
    max: int = Field(ge=1)
    unit: Literal["BUSINESS_DAY"]


class ProductCommerce(ContractModel):
    status: Literal[
        "IN_DEVELOPMENT",
        "EARLY_ACCESS",
        "PRE_ORDER",
        "AVAILABLE",
        "TEMPORARILY_UNAVAILABLE",
        "SOLD_OUT",
        "DISCONTINUED",
    ]
    statusLabel: str = Field(min_length=1)
    priceType: PriceType
    currency: Literal["VND"]
    displayPrice: bool
    minimumQuantity: int = Field(ge=1)
    maximumQuantity: int = Field(ge=1)
    responseTime: ResponseTime
    cancellationPolicyId: str = Field(min_length=1)


class Ingredient(ContractModel):
    name: str = Field(min_length=1)
    quantity: float | None = Field(default=None, ge=0)
    unit: str | None = None
    origin: str | None = None
    verified: bool


class ProductSpecification(ContractModel):
    ingredients: list[Ingredient]
    origin: list[str]
    packagingMaterials: list[str]
    isPrototype: bool
    isAssumption: bool
    verificationStatus: VerificationStatus
    contentVersion: str = Field(min_length=1)


class BrewingStep(ContractModel):
    id: str = Field(min_length=1)
    order: int = Field(ge=1)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    mediaUrl: str | None = None


class BrewingSpecification(ContractModel):
    steps: list[BrewingStep]
    warnings: list[str]
    isAssumption: bool
    verificationStatus: VerificationStatus
    contentVersion: str = Field(min_length=1)


class StorageSpecification(ContractModel):
    storageInstructions: list[str]
    isAssumption: bool
    verificationStatus: VerificationStatus
    contentVersion: str = Field(min_length=1)


class SafetySpecification(ContractModel):
    allergenInformation: list[str]
    usageWarnings: list[str]
    foodSafetyStatus: VerificationStatus
    microbiologyTested: bool
    moistureTested: bool
    isAssumption: bool
    verificationStatus: VerificationStatus
    contentVersion: str = Field(min_length=1)


class FulfillmentSpecification(ContractModel):
    deliveryScopes: list[DeliveryScope]
    pickupAvailable: bool
    shippingFeeType: Literal["FIXED", "CALCULATED", "CONFIRMED_LATER"]
    fragile: bool
    requiresSpecialPackaging: bool
    deliveryNotes: str | None = None
    isAssumption: bool
    verificationStatus: VerificationStatus
    contentVersion: str = Field(min_length=1)


class ProductExperience(ContractModel):
    ritualAvailable: bool
    ritualSlug: str | None = None
    steps: list[BrewingStep]
    story: dict[str, str]
    qrEnabled: bool


class ProductMedia(ContractModel):
    gallery: list[str]
    instructionImages: list[str]
    altText: str = Field(min_length=1)


class ProductSeo(ContractModel):
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    keywords: list[str]
    canonicalUrl: str = Field(min_length=1)


class ProductMetadata(ContractModel):
    contentVersion: str = Field(min_length=1)


class ProductContract(ContractModel):
    id: str = Field(min_length=1)
    slug: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    name: str = Field(min_length=1)
    shortName: str = Field(min_length=1)
    productLine: Literal["CLASSIC", "PETAL_PACK", "GIFT_SET"]
    role: Literal["Giữ", "Mở", "Trao"]
    tagline: str = Field(min_length=1)
    shortDescription: str = Field(min_length=1)
    fullDescription: str = Field(min_length=1)
    status: Literal["draft", "active", "archived"]
    commerce: ProductCommerce
    specification: ProductSpecification
    brewing: BrewingSpecification
    storage: StorageSpecification
    safety: SafetySpecification
    fulfillment: FulfillmentSpecification
    variants: list[ProductVariant] = Field(min_length=1)
    experience: ProductExperience
    media: ProductMedia
    seo: ProductSeo
    metadata: ProductMetadata


class RefundRule(ContractModel):
    refundPercent: int = Field(ge=0, le=100)
    allowCancellation: bool
    allowReplacement: bool = False
    description: str = Field(min_length=1)


class CancellationStages(ContractModel):
    beforePayment: RefundRule
    paidBeforePreparation: RefundRule
    preparingStandardProduct: RefundRule
    customizedProduct: RefundRule
    handedToCarrier: RefundRule
    sellerUnableToFulfill: RefundRule
    defectiveOrIncorrectProduct: RefundRule


class CancellationPolicyContract(ContractModel):
    id: str = Field(min_length=1)
    version: str = Field(min_length=1)
    currency: Literal["VND"]
    status: Literal["draft", "active", "archived"]
    stages: CancellationStages
