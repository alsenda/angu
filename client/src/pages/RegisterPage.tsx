import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthLayout from '../components/layout/AuthLayout';

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, tenantSlug } = useAuthStore();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/register', { ...data, tenantSlug });
      login(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error al registrarse';
      setError('root', { message: msg });
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      footer={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nombre completo" placeholder="Ana García" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
        <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />
        {errors.root && <div className="alert-error">{errors.root.message}</div>}
        <Button type="submit" full loading={isSubmitting}>Crear cuenta gratuita</Button>
      </form>
    </AuthLayout>
  );
}
