-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create apps table
CREATE TABLE public.apps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT NOT NULL,
    downloads INTEGER DEFAULT 0,
    creator_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    version TEXT DEFAULT '1.0.0',
    component_code TEXT NOT NULL,
    published BOOLEAN DEFAULT false
);

-- Create installed_apps table
CREATE TABLE public.installed_apps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    app_id UUID REFERENCES public.apps(id),
    desktop_icon JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) UNIQUE,
    background_url TEXT DEFAULT 'https://images.unsplash.com/photo-1520769669658-f07657f5a307',
    theme TEXT DEFAULT 'dark',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installed_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Apps policies
CREATE POLICY "Published apps are viewable by everyone" 
    ON public.apps FOR SELECT 
    USING (published = true);

CREATE POLICY "Users can create apps" 
    ON public.apps FOR INSERT 
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own apps" 
    ON public.apps FOR UPDATE 
    USING (auth.uid() = creator_id);

-- Installed apps policies
CREATE POLICY "Users can view own installed apps" 
    ON public.installed_apps FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can install apps" 
    ON public.installed_apps FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installed apps" 
    ON public.installed_apps FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own installed apps" 
    ON public.installed_apps FOR DELETE 
    USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" 
    ON public.user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
    ON public.user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
    ON public.user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);

    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 