import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Group, Box, TypographyStylesProvider, Text } from '@mantine/core';
import { useForm, SubmitHandler } from 'react-hook-form';
import TextInputComponent from './TextInput';
import TextareaComponent from './Textarea';
import ButtonComponent from './Button';
import CheckboxComponent from './Checkbox';
import SelectComponent from './Select';

interface Field {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
  choices: string[];
  error: string;
}

interface FormProps {
  block: {
    id: string;
    name: string;
    fields: Field[];
    submit: string;
    on_error: string;
    on_success: string;
    on_success_message: string;
    on_success_redirect: {
      slug: string;
    };
  };
  slug: string;
  id: string;
}

interface FormData {
  [key: string]: string | string[];
}

function FormComponent({ block, slug }: FormProps) {
  const {
    id,
    name: formName,
    fields,
    submit,
    on_error,
    on_success,
    on_success_message,
    on_success_redirect,
  } = block;
  const formFields = fields.map((item) => Object.values(item)[0]) as Field[];
  const [data, setData] = useState<FormData | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = (values) => {
    setDisabled(true);
    const url = '/api/submit';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formId: id, formName, slug, ...values }),
    })
      .then(() => {
        setData(values);
        reset();
        if (on_success === 'redirect' && on_success_redirect.slug) {
          router.push(`/${on_success_redirect.slug}`);
        }
        setDisabled(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        reset();
        setDisabled(false);
      });
  };
  return (
    <Container>
      <Box sx={{ maxWidth: 300 }}>
        {errorMessage && (
          <>
            <TypographyStylesProvider>
              <Text dangerouslySetInnerHTML={{ __html: on_error }} />
            </TypographyStylesProvider>
            {errorMessage}
          </>
        )}
        {data ? (
          <TypographyStylesProvider>
            <Text dangerouslySetInnerHTML={{ __html: on_success_message }} />
          </TypographyStylesProvider>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {formFields.map((field) => {
              const {
                id: fieldId,
                name: formFieldName,
                label: formFieldLabel,
                placeholder: formFieldPlaceholder,
                required: formFieldMandatory,
                type: formFieldType,
                choices: formFieldSelect,
              } = field;
              const fieldError = !!errors[formFieldName];
              switch (formFieldType) {
                case 'input':
                case 'phone':
                case 'email':
                  return (
                    <TextInputComponent
                      key={fieldId}
                      name={formFieldName}
                      label={formFieldLabel}
                      placeholder={formFieldPlaceholder}
                      type={formFieldType}
                      withAsterisk={formFieldMandatory}
                      error={fieldError}
                      register={register}
                    />
                  );
                case 'checkbox':
                  return (
                    <CheckboxComponent
                      key={fieldId}
                      name={formFieldName}
                      label={formFieldLabel}
                      withAsterisk={formFieldMandatory}
                      error={fieldError}
                      register={register}
                    />
                  );
                case 'textarea':
                  return (
                    <TextareaComponent
                      key={fieldId}
                      name={formFieldName}
                      label={formFieldLabel}
                      placeholder={formFieldPlaceholder}
                      withAsterisk={formFieldMandatory}
                      error={fieldError}
                      register={register}
                    />
                  );
                case 'select':
                  return (
                    <SelectComponent
                      key={fieldId}
                      name={formFieldName}
                      label={formFieldLabel}
                      placeholder={formFieldPlaceholder}
                      withAsterisk={formFieldMandatory}
                      data={formFieldSelect}
                      error={fieldError}
                      register={register}
                      setValue={setValue}
                    />
                  );
                default:
                  return null;
              }
            })}
            <Group position="right" mt="md">
              <ButtonComponent disabled={disabled}>{submit}</ButtonComponent>
            </Group>
          </form>
        )}
      </Box>
    </Container>
  );
}

export default FormComponent;
