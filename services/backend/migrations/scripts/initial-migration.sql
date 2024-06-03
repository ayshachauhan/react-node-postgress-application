-- Type: practice_status

-- DROP TYPE IF EXISTS public.practice_status;

CREATE TYPE public.practice_status AS ENUM
    ('active', 'inactive', 'pending');

ALTER TYPE public.practice_status
    OWNER TO azentia;


-- Type: referrers_referrertype_enum

-- DROP TYPE IF EXISTS public.referrers_referrertype_enum;

CREATE TYPE public.referrers_referrertype_enum AS ENUM
    ('PCP', 'Ophtho', 'Optom', 'Specialist');

ALTER TYPE public.referrers_referrertype_enum
    OWNER TO azentia;

-- Type: templates_meridiem_enum

-- DROP TYPE IF EXISTS public.templates_meridiem_enum;

CREATE TYPE public.templates_meridiem_enum AS ENUM
    ('AM', 'PM');

ALTER TYPE public.templates_meridiem_enum
    OWNER TO azentia;


-- Type: templates_messagetype_enum

-- DROP TYPE IF EXISTS public.templates_messagetype_enum;

CREATE TYPE public.templates_messagetype_enum AS ENUM
    ('booking', 'referrer', 'pcp', 'preop', 'postop');

ALTER TYPE public.templates_messagetype_enum
    OWNER TO azentia;

-- Type: users_status_enum

-- DROP TYPE IF EXISTS public.users_status_enum;

CREATE TYPE public.users_status_enum AS ENUM
    ('active', 'inactive', 'pending');

ALTER TYPE public.users_status_enum
    OWNER TO azentia;


-- Type: users_type_enum

-- DROP TYPE IF EXISTS public.users_type_enum;

CREATE TYPE public.users_type_enum AS ENUM
    ('admin', 'doctor', 'employee', 'physician');

ALTER TYPE public.users_type_enum
    OWNER TO azentia;


--
-- TOC entry 221 (class 1259 OID 16475)
-- Name: calendars; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.calendars (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    date timestamp without time zone NOT NULL,
    "bookedSlots" integer NOT NULL,
    "maxSlots" integer DEFAULT 14 NOT NULL,
    "practiceId" uuid,
    "surgeryConfigurationId" uuid,
    "userId" uuid
);


ALTER TABLE public.calendars OWNER TO azentia;

--
-- TOC entry 227 (class 1259 OID 16544)
-- Name: evals; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.evals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    "insuranceDetails" character varying NOT NULL,
    date timestamp without time zone NOT NULL,
    status character varying NOT NULL,
    eye character varying NOT NULL,
    "surgeryTypeId" uuid,
    "patientId" uuid,
    "practiceHomeId" uuid,
    "insuranceTypeId" uuid,
    "doctorId" uuid
);


ALTER TABLE public.evals OWNER TO azentia;

--
-- TOC entry 222 (class 1259 OID 16484)
-- Name: insurance_types; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.insurance_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    name character varying NOT NULL,
    "practiceId" uuid
);


ALTER TABLE public.insurance_types OWNER TO azentia;

--
-- TOC entry 226 (class 1259 OID 16533)
-- Name: patients; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.patients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    mrn integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    "phoneNumber" character varying NOT NULL,
    active boolean DEFAULT false NOT NULL,
    pcp character varying NOT NULL,
    details character varying NOT NULL,
    "practiceId" uuid,
    "referrerId" uuid
);


ALTER TABLE public.patients OWNER TO azentia;

--
-- TOC entry 216 (class 1259 OID 16396)
-- Name: permissions; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    name character varying
);


ALTER TABLE public.permissions OWNER TO azentia;

--
-- TOC entry 224 (class 1259 OID 16513)
-- Name: practice_homes; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.practice_homes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    name character varying NOT NULL,
    "practiceId" uuid
);


ALTER TABLE public.practice_homes OWNER TO azentia;

--
-- TOC entry 217 (class 1259 OID 16413)
-- Name: practices; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.practices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    name character varying NOT NULL,
    code character varying NOT NULL,
    status public.practice_status DEFAULT 'pending'::public.practice_status NOT NULL,
    "photoUrl" character varying
);


ALTER TABLE public.practices OWNER TO azentia;

--
-- TOC entry 223 (class 1259 OID 16503)
-- Name: referrers; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.referrers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    "practiceId" uuid NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    email character varying NOT NULL,
    "referrerType" public.referrers_referrertype_enum NOT NULL
);


ALTER TABLE public.referrers OWNER TO azentia;

--
-- TOC entry 225 (class 1259 OID 16523)
-- Name: surgeries; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.surgeries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    "insuranceDetails" character varying NOT NULL,
    date timestamp without time zone,
    "bodyPart" character varying NOT NULL,
    "selectedSurgeryOptions" jsonb NOT NULL,
    "totalHospitalPricing" integer NOT NULL,
    "totalProfessionalPricing" integer NOT NULL,
    "selectedCheckListOptions" jsonb,
    "surgeryConfigurationId" uuid,
    "patientId" uuid,
    "practiceHomeId" uuid,
    "insuranceTypeId" uuid,
    "doctorId" uuid
);


ALTER TABLE public.surgeries OWNER TO azentia;

--
-- TOC entry 220 (class 1259 OID 16463)
-- Name: surgery_configurations; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.surgery_configurations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    name character varying NOT NULL,
    "bodyPart" character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    facility character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    options jsonb,
    "checkList" jsonb,
    color character varying,
    "surgeryTypeId" uuid
);


ALTER TABLE public.surgery_configurations OWNER TO azentia;

--
-- TOC entry 219 (class 1259 OID 16453)
-- Name: surgery_types; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.surgery_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    name character varying NOT NULL,
    "practiceId" uuid
);


ALTER TABLE public.surgery_types OWNER TO azentia;

--
-- TOC entry 229 (class 1259 OID 16581)
-- Name: templates; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    active boolean DEFAULT false NOT NULL,
    "messageType" public.templates_messagetype_enum,
    "dateOffset" integer NOT NULL,
    meridiem public.templates_meridiem_enum,
    "emailSubject" character varying,
    "emailBody" character varying,
    "emailAttachment" character varying,
    "email1stCataract" character varying,
    "email2ndCataract" character varying,
    "messageText" character varying,
    version character varying,
    "practiceId" uuid,
    "surgeonId" uuid,
    "surgeryTypeId" uuid
);


ALTER TABLE public.templates OWNER TO azentia;

--
-- TOC entry 230 (class 1259 OID 16592)
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.user_permissions (
    "permissionId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.user_permissions OWNER TO azentia;

--
-- TOC entry 231 (class 1259 OID 16599)
-- Name: user_practices; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.user_practices (
    "practiceId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.user_practices OWNER TO azentia;

--
-- TOC entry 218 (class 1259 OID 16441)
-- Name: users; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "userName" character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    "fullName" character varying NOT NULL,
    url character varying NOT NULL,
    status public.users_status_enum DEFAULT 'pending'::public.users_status_enum NOT NULL,
    type public.users_type_enum DEFAULT 'employee'::public.users_type_enum NOT NULL,
    "contactNumber" character varying NOT NULL
);


ALTER TABLE public.users OWNER TO azentia;

--
-- TOC entry 228 (class 1259 OID 16554)
-- Name: videos; Type: TABLE; Schema: public; Owner: azentia
--

CREATE TABLE public.videos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateDeleted" timestamp without time zone,
    "practiceId" uuid NOT NULL,
    name character varying NOT NULL,
    "urlEmbed" character varying NOT NULL,
    url character varying NOT NULL,
    "surgeryTypeId" uuid
);


ALTER TABLE public.videos OWNER TO azentia;


--
-- TOC entry 3322 (class 2606 OID 16423)
-- Name: practices PK_0934829c5859a843625e6ff1c34; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.practices
    ADD CONSTRAINT "PK_0934829c5859a843625e6ff1c34" PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 16553)
-- Name: evals PK_18b6fd21910f7fb813cd3a07f17; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.evals
    ADD CONSTRAINT "PK_18b6fd21910f7fb813cd3a07f17" PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 16522)
-- Name: practice_homes PK_3980c59711205429b49937d1ee5; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.practice_homes
    ADD CONSTRAINT "PK_3980c59711205429b49937d1ee5" PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 16493)
-- Name: insurance_types PK_39d2d32865e5a5613a76cc1374c; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.insurance_types
    ADD CONSTRAINT "PK_39d2d32865e5a5613a76cc1374c" PRIMARY KEY (id);


--
-- TOC entry 3350 (class 2606 OID 16596)
-- Name: user_permissions PK_4d0e283b03781d1796e62dc6195; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "PK_4d0e283b03781d1796e62dc6195" PRIMARY KEY ("permissionId", "userId");


--
-- TOC entry 3346 (class 2606 OID 16591)
-- Name: templates PK_515948649ce0bbbe391de702ae5; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 16474)
-- Name: surgery_configurations PK_65e6132b168e457e038086bc313; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgery_configurations
    ADD CONSTRAINT "PK_65e6132b168e457e038086bc313" PRIMARY KEY (id);


--
-- TOC entry 3330 (class 2606 OID 16483)
-- Name: calendars PK_90dc0330e8ec9028e23c290dee8; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "PK_90dc0330e8ec9028e23c290dee8" PRIMARY KEY (id);


--
-- TOC entry 3320 (class 2606 OID 16405)
-- Name: permissions PK_920331560282b8bd21bb02290df; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 16462)
-- Name: surgery_types PK_95dcf57f70106aa26d43b9e39aa; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgery_types
    ADD CONSTRAINT "PK_95dcf57f70106aa26d43b9e39aa" PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 16532)
-- Name: surgeries PK_9b308d8aa20274bbbbc3f33489d; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT "PK_9b308d8aa20274bbbbc3f33489d" PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 16452)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 16543)
-- Name: patients PK_a7f0b9fcbb3469d5ec0b0aceaa7; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16512)
-- Name: referrers PK_ad6b2d9ca26305d3dba285dac0d; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.referrers
    ADD CONSTRAINT "PK_ad6b2d9ca26305d3dba285dac0d" PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 16603)
-- Name: user_practices PK_d6d645007c8917484d53aea90e6; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.user_practices
    ADD CONSTRAINT "PK_d6d645007c8917484d53aea90e6" PRIMARY KEY ("practiceId", "userId");


--
-- TOC entry 3344 (class 2606 OID 16563)
-- Name: videos PK_e4c86c0cf95aff16e9fb8220f6b; Type: CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY (id);


--
-- TOC entry 3351 (class 1259 OID 16604)
-- Name: IDX_0143c534912fea147f4225b0e5; Type: INDEX; Schema: public; Owner: azentia
--

CREATE INDEX "IDX_0143c534912fea147f4225b0e5" ON public.user_practices USING btree ("practiceId");


--
-- TOC entry 3352 (class 1259 OID 16605)
-- Name: IDX_7aa85e11501e43615f27063503; Type: INDEX; Schema: public; Owner: azentia
--

CREATE INDEX "IDX_7aa85e11501e43615f27063503" ON public.user_practices USING btree ("userId");


--
-- TOC entry 3347 (class 1259 OID 16597)
-- Name: IDX_cf38f85e52ee274ba9a01901ed; Type: INDEX; Schema: public; Owner: azentia
--

CREATE INDEX "IDX_cf38f85e52ee274ba9a01901ed" ON public.user_permissions USING btree ("permissionId");


--
-- TOC entry 3348 (class 1259 OID 16598)
-- Name: IDX_f05ccc7935f14874d7f89ba030; Type: INDEX; Schema: public; Owner: azentia
--

CREATE INDEX "IDX_f05ccc7935f14874d7f89ba030" ON public.user_permissions USING btree ("userId");


--
-- TOC entry 3380 (class 2606 OID 16731)
-- Name: user_practices FK_0143c534912fea147f4225b0e59; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.user_practices
    ADD CONSTRAINT "FK_0143c534912fea147f4225b0e59" FOREIGN KEY ("practiceId") REFERENCES public.practices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3357 (class 2606 OID 16616)
-- Name: calendars FK_2d2084cabc9c571b47d90ccc37f; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "FK_2d2084cabc9c571b47d90ccc37f" FOREIGN KEY ("practiceId") REFERENCES public.practices(id);


--
-- TOC entry 3358 (class 2606 OID 16626)
-- Name: calendars FK_335d9e9af743fe91668b8f0d6fd; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "FK_335d9e9af743fe91668b8f0d6fd" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- TOC entry 3362 (class 2606 OID 16651)
-- Name: surgeries FK_42474a4b2ab76383ca951a41bb9; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT "FK_42474a4b2ab76383ca951a41bb9" FOREIGN KEY ("practiceHomeId") REFERENCES public.practice_homes(id);


--
-- TOC entry 3369 (class 2606 OID 16696)
-- Name: evals FK_448e3c596c26f6dceaee18610a3; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.evals
    ADD CONSTRAINT "FK_448e3c596c26f6dceaee18610a3" FOREIGN KEY ("doctorId") REFERENCES public.users(id);


--
-- TOC entry 3356 (class 2606 OID 16611)
-- Name: surgery_configurations FK_51af6ef6e86985337dc29eab60d; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgery_configurations
    ADD CONSTRAINT "FK_51af6ef6e86985337dc29eab60d" FOREIGN KEY ("surgeryTypeId") REFERENCES public.surgery_types(id);


--
-- TOC entry 3375 (class 2606 OID 16711)
-- Name: templates FK_5b1ac3d4cefe39ecd92f432ad58; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT "FK_5b1ac3d4cefe39ecd92f432ad58" FOREIGN KEY ("surgeonId") REFERENCES public.users(id);


--
-- TOC entry 3363 (class 2606 OID 16661)
-- Name: surgeries FK_5de889fcd68ddaf60b065e4b596; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT "FK_5de889fcd68ddaf60b065e4b596" FOREIGN KEY ("doctorId") REFERENCES public.users(id);


--
-- TOC entry 3364 (class 2606 OID 16641)
-- Name: surgeries FK_6eeb9430b75dfab7d38235828b9; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT "FK_6eeb9430b75dfab7d38235828b9" FOREIGN KEY ("surgeryConfigurationId") REFERENCES public.surgery_configurations(id);


--
-- TOC entry 3376 (class 2606 OID 16716)
-- Name: templates FK_6fefbda986793978711466aac1f; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT "FK_6fefbda986793978711466aac1f" FOREIGN KEY ("surgeryTypeId") REFERENCES public.surgery_types(id);


--
-- TOC entry 3365 (class 2606 OID 16656)
-- Name: surgeries FK_739cdc3e7ff8cf258221f142b81; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT "FK_739cdc3e7ff8cf258221f142b81" FOREIGN KEY ("insuranceTypeId") REFERENCES public.insurance_types(id);


--
-- TOC entry 3359 (class 2606 OID 16621)
-- Name: calendars FK_7921d3a503299cefc92084b51bb; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "FK_7921d3a503299cefc92084b51bb" FOREIGN KEY ("surgeryConfigurationId") REFERENCES public.surgery_configurations(id);


--
-- TOC entry 3381 (class 2606 OID 16736)
-- Name: user_practices FK_7aa85e11501e43615f270635039; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.user_practices
    ADD CONSTRAINT "FK_7aa85e11501e43615f270635039" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3367 (class 2606 OID 16666)
-- Name: patients FK_847b97dcc530bcb2ba63f298255; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "FK_847b97dcc530bcb2ba63f298255" FOREIGN KEY ("practiceId") REFERENCES public.practices(id);


--
-- TOC entry 3370 (class 2606 OID 16676)
-- Name: evals FK_85e5b886f74739f4defedc7de94; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.evals
    ADD CONSTRAINT "FK_85e5b886f74739f4defedc7de94" FOREIGN KEY ("surgeryTypeId") REFERENCES public.surgery_types(id);


--
-- TOC entry 3360 (class 2606 OID 16631)
-- Name: insurance_types FK_8bdc35e58e3571b5347ce270b16; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.insurance_types
    ADD CONSTRAINT "FK_8bdc35e58e3571b5347ce270b16" FOREIGN KEY ("practiceId") REFERENCES public.practices(id);


--
-- TOC entry 3377 (class 2606 OID 16706)
-- Name: templates FK_9514630fb13f1ba610f44e19e8a; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT "FK_9514630fb13f1ba610f44e19e8a" FOREIGN KEY ("practiceId") REFERENCES public.practices(id);


--
-- TOC entry 3368 (class 2606 OID 16671)
-- Name: patients FK_960db2efc663a561ab1fd6d5c5b; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "FK_960db2efc663a561ab1fd6d5c5b" FOREIGN KEY ("referrerId") REFERENCES public.referrers(id);


--
-- TOC entry 3371 (class 2606 OID 16691)
-- Name: evals FK_9cbbbe7fa243076925aa2c47290; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.evals
    ADD CONSTRAINT "FK_9cbbbe7fa243076925aa2c47290" FOREIGN KEY ("insuranceTypeId") REFERENCES public.insurance_types(id);


--
-- TOC entry 3372 (class 2606 OID 16686)
-- Name: evals FK_b85cd50a590a2773fcb999e8d31; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.evals
    ADD CONSTRAINT "FK_b85cd50a590a2773fcb999e8d31" FOREIGN KEY ("practiceHomeId") REFERENCES public.practice_homes(id);


--
-- TOC entry 3361 (class 2606 OID 16636)
-- Name: practice_homes FK_bd7c3a55c076c7a23e5046a9866; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.practice_homes
    ADD CONSTRAINT "FK_bd7c3a55c076c7a23e5046a9866" FOREIGN KEY ("practiceId") REFERENCES public.practices(id);


--
-- TOC entry 3355 (class 2606 OID 16606)
-- Name: surgery_types FK_bdfaaa4aa46728e95bd45eb8873; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgery_types
    ADD CONSTRAINT "FK_bdfaaa4aa46728e95bd45eb8873" FOREIGN KEY ("practiceId") REFERENCES public.practices(id);


--
-- TOC entry 3373 (class 2606 OID 16681)
-- Name: evals FK_be67d11eca7785433fb8460200c; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.evals
    ADD CONSTRAINT "FK_be67d11eca7785433fb8460200c" FOREIGN KEY ("patientId") REFERENCES public.patients(id);


--
-- TOC entry 3366 (class 2606 OID 16646)
-- Name: surgeries FK_ce7ea5d2e5bf4c62c087b958c15; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT "FK_ce7ea5d2e5bf4c62c087b958c15" FOREIGN KEY ("patientId") REFERENCES public.patients(id);


--
-- TOC entry 3378 (class 2606 OID 16721)
-- Name: user_permissions FK_cf38f85e52ee274ba9a01901ed2; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_cf38f85e52ee274ba9a01901ed2" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3374 (class 2606 OID 16701)
-- Name: videos FK_e1d78dd3fce656dafde10dc779a; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "FK_e1d78dd3fce656dafde10dc779a" FOREIGN KEY ("surgeryTypeId") REFERENCES public.surgery_types(id);


--
-- TOC entry 3379 (class 2606 OID 16726)
-- Name: user_permissions FK_f05ccc7935f14874d7f89ba030f; Type: FK CONSTRAINT; Schema: public; Owner: azentia
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


