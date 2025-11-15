import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

/* ---------------------------------------------------------
   HOC: withNavigation 
   Injects navigate() into class-based components
--------------------------------------------------------- */
export function withNavigation(Component) {
  return function Wrapper(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

/* ---------------------------------------------------------
   HOC: withForm
   Injects react-hook-form (register, handleSubmit, etc.)
   into class-based components
--------------------------------------------------------- */
export function withForm(Component) {
  return function Wrapper(props) {
    const form = useForm();
    return <Component {...props} form={form} />;
  };
}
