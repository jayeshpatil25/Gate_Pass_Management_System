import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


export function withNavigation(Component) {
  return function Wrapper(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}


export function withForm(Component) {
  return function Wrapper(props) {
    const form = useForm();
    return <Component {...props} form={form} />;
  };
}
