"use client";

import * as React from "react";
import { Controller, FormProvider } from "react-hook-form";

const Form = FormProvider;
const FormField = Controller;

const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium">{children}</label>
);

const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const FormMessage = () => null;

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
