import { Exclude, Expose, Transform } from 'class-transformer';
export class UserResponseDto {
  //! This is necessary otherwise _id will be a new ObjectId during transformation
  @Transform(({ obj }) => {
    const mongoDoc = obj as { _id: { toString(): string } };
    return mongoDoc._id.toString();
  })
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
