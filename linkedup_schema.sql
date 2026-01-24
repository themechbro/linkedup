--
-- PostgreSQL database dump
--

\restrict SepExv7KJ1WkpHFMXbgubMiuGFnrq3ctAslCJgVKNIW25Nng5bjAJJ3NHwN4pOP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-01-25 00:07:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 266 (class 1255 OID 139990)
-- Name: update_conversation_last_message(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_conversation_last_message() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_id = NEW.message_id,
    last_message_at = NEW.created_at
  WHERE 
    (user1_id = LEAST(NEW.sender_id, NEW.receiver_id) 
     AND user2_id = GREATEST(NEW.sender_id, NEW.receiver_id));
  
  -- If conversation doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO conversations (user1_id, user2_id, last_message_id, last_message_at)
    VALUES (
      LEAST(NEW.sender_id, NEW.receiver_id),
      GREATEST(NEW.sender_id, NEW.receiver_id),
      NEW.message_id,
      NEW.created_at
    );
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_conversation_last_message() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 139869)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    likes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status character varying(20) DEFAULT 'posted'::character varying,
    media_url json[]
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 139916)
-- Name: connection_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connection_requests (
    id integer NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.connection_requests OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 139915)
-- Name: connection_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.connection_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.connection_requests_id_seq OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 224
-- Name: connection_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.connection_requests_id_seq OWNED BY public.connection_requests.id;


--
-- TOC entry 223 (class 1259 OID 139908)
-- Name: connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connections (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    connection_id uuid NOT NULL,
    connected_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.connections OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 139907)
-- Name: connections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.connections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.connections_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 222
-- Name: connections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.connections_id_seq OWNED BY public.connections.id;


--
-- TOC entry 227 (class 1259 OID 139961)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    conversation_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user1_id uuid NOT NULL,
    user2_id uuid NOT NULL,
    last_message_id uuid,
    last_message_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_user_order CHECK ((user1_id < user2_id))
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 140042)
-- Name: education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.education (
    education_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    school_name character varying(255) NOT NULL,
    degree character varying(100),
    field_of_study character varying(100),
    start_date date NOT NULL,
    end_date date,
    grade character varying(50),
    activities text,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    currently_studying boolean
);


ALTER TABLE public.education OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 139995)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    location text,
    job_type text,
    description text,
    posted_by uuid NOT NULL,
    is_brand boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status text DEFAULT 'active'::text,
    searchable_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, ((((((COALESCE(title, ''::text) || ' '::text) || COALESCE(company, ''::text)) || ' '::text) || COALESCE(location, ''::text)) || ' '::text) || COALESCE(description, ''::text)))) STORED,
    applylink text,
    apply_count integer DEFAULT 0,
    CONSTRAINT jobs_job_type_check CHECK ((job_type = ANY (ARRAY['Full-time'::text, 'Part-time'::text, 'Internship'::text, 'Contract'::text, 'Remote'::text])))
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 139934)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    likes integer DEFAULT 0,
    liked_by uuid[],
    CONSTRAINT check_different_users CHECK ((sender_id <> receiver_id))
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 139853)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    content text,
    media_url json,
    likes integer DEFAULT 0,
    status text DEFAULT 'created'::text,
    owner uuid NOT NULL,
    liked_by uuid[],
    repost_of uuid,
    repost_count integer DEFAULT 0
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 139896)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 139840)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text,
    password character varying,
    email character varying,
    type character varying,
    created_at timestamp without time zone DEFAULT now(),
    full_name character varying,
    headline text,
    profile_picture text,
    cover_pic text,
    isverified boolean DEFAULT false,
    isbrand boolean DEFAULT false,
    about character varying,
    website text,
    industry character varying,
    companysize character varying,
    hq character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4786 (class 2604 OID 139919)
-- Name: connection_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connection_requests ALTER COLUMN id SET DEFAULT nextval('public.connection_requests_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 139911)
-- Name: connections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections ALTER COLUMN id SET DEFAULT nextval('public.connections_id_seq'::regclass);


--
-- TOC entry 4817 (class 2606 OID 139880)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- TOC entry 4824 (class 2606 OID 139925)
-- Name: connection_requests connection_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connection_requests
    ADD CONSTRAINT connection_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 139914)
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- TOC entry 4833 (class 2606 OID 139969)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (conversation_id);


--
-- TOC entry 4846 (class 2606 OID 140051)
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (education_id);


--
-- TOC entry 4848 (class 2606 OID 140053)
-- Name: education education_user_idx; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_idx UNIQUE (user_id, school_name, degree, start_date);


--
-- TOC entry 4844 (class 2606 OID 140008)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 139945)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- TOC entry 4815 (class 2606 OID 139863)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 139902)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 4838 (class 2606 OID 139971)
-- Name: conversations unique_conversation; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id);


--
-- TOC entry 4811 (class 2606 OID 139850)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4813 (class 2606 OID 139852)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4834 (class 1259 OID 139989)
-- Name: idx_conversations_last_message; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_last_message ON public.conversations USING btree (last_message_at DESC);


--
-- TOC entry 4835 (class 1259 OID 139987)
-- Name: idx_conversations_user1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_user1 ON public.conversations USING btree (user1_id);


--
-- TOC entry 4836 (class 1259 OID 139988)
-- Name: idx_conversations_user2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_user2 ON public.conversations USING btree (user2_id);


--
-- TOC entry 4849 (class 1259 OID 140060)
-- Name: idx_education_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_education_dates ON public.education USING btree (start_date DESC, end_date DESC);


--
-- TOC entry 4850 (class 1259 OID 140059)
-- Name: idx_education_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_education_user ON public.education USING btree (user_id);


--
-- TOC entry 4839 (class 1259 OID 140010)
-- Name: idx_jobs_job_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_job_type ON public.jobs USING btree (job_type);


--
-- TOC entry 4840 (class 1259 OID 140009)
-- Name: idx_jobs_posted_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_posted_by ON public.jobs USING btree (posted_by);


--
-- TOC entry 4841 (class 1259 OID 140012)
-- Name: idx_jobs_searchable_tsv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_searchable_tsv ON public.jobs USING gin (searchable_tsv);


--
-- TOC entry 4842 (class 1259 OID 140011)
-- Name: idx_jobs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_status ON public.jobs USING btree (status);


--
-- TOC entry 4825 (class 1259 OID 139960)
-- Name: idx_messages_conversation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_conversation ON public.messages USING btree (sender_id, receiver_id, created_at DESC);


--
-- TOC entry 4826 (class 1259 OID 139958)
-- Name: idx_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at DESC);


--
-- TOC entry 4827 (class 1259 OID 139959)
-- Name: idx_messages_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_read ON public.messages USING btree (read);


--
-- TOC entry 4828 (class 1259 OID 139957)
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id);


--
-- TOC entry 4829 (class 1259 OID 139956)
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- TOC entry 4818 (class 1259 OID 139903)
-- Name: idx_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_session_expire ON public.session USING btree (expire);


--
-- TOC entry 4861 (class 2620 OID 139991)
-- Name: messages trigger_update_conversation; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_conversation AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();


--
-- TOC entry 4852 (class 2606 OID 139881)
-- Name: comments comments_parent_comment_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_comment_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 139886)
-- Name: comments comments_post_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 4854 (class 2606 OID 139891)
-- Name: comments comments_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 139982)
-- Name: conversations conversations_last_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_last_message_id_fkey FOREIGN KEY (last_message_id) REFERENCES public.messages(message_id) ON DELETE SET NULL;


--
-- TOC entry 4858 (class 2606 OID 139972)
-- Name: conversations conversations_user1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 139977)
-- Name: conversations conversations_user2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4860 (class 2606 OID 140054)
-- Name: education education_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4855 (class 2606 OID 139951)
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4856 (class 2606 OID 139946)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 139864)
-- Name: posts posts_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_owner_fkey FOREIGN KEY (owner) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2026-01-25 00:07:22

--
-- PostgreSQL database dump complete
--

\unrestrict SepExv7KJ1WkpHFMXbgubMiuGFnrq3ctAslCJgVKNIW25Nng5bjAJJ3NHwN4pOP

