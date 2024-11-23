import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          Sign in to access all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary-foreground))',
                }
              }
            }
          }}
          providers={['github', 'google']}
        />
      </CardContent>
    </Card>
  );
};