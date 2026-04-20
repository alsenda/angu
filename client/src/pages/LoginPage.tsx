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
  email: z.string().min(1, 'Introduce tu email'),
  password: z.string().min(1, 'Introduce tu contraseña'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, tenantSlug } = useAuthStore();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', { ...data, tenantSlug });
      login(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error al iniciar sesión';
      setError('root', { message: msg });
    }
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      footer={<>¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
        <Input label="Contraseña" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        {errors.root && <div className="alert-error">{errors.root.message}</div>}
        <Button type="submit" full loading={isSubmitting}>Iniciar sesión</Button>
      </form>
    </AuthLayout>
  );
}
