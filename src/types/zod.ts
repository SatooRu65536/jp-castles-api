import { ZodError } from "zod";

type ZodSuccess<T> = {
  success: true;
  data: T;
};

type ZodErr<T> = {
  success: false;
  error: ZodError<any>;
  data: T;
};

export type ZodHookRes<T> = ZodSuccess<T> | ZodErr<T>;
