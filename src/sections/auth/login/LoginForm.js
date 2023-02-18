import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { useForm } from "react-hook-form";
import Iconify from '../../../components/iconify';

import { logIn } from '../../../firebase/firebase'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {
    logIn(data, navigate)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField 
        name="email" 
        label="Email address" 
        {...register("email", { required: true })} 
        // eslint-disable-next-line no-unneeded-ternary
        error={!!errors.password}
        helperText={errors.email &&"This field is required"}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("password", { required: true })}
          error={!!errors.password}
          helperText={errors.password &&"This field is required"}
        />
        

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Login
        </LoadingButton>
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

    </Box>
  );
}
