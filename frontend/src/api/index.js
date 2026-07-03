// Production API Service
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

const DEFAULT_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const adminHeaders = (token) => ({ "x-admin-token": token });

async function parse(res){
  try{return await res.json();}catch{return {};}
}

async function request(endpoint, options={}){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), DEFAULT_TIMEOUT);

  try{
    const response = await fetch(`${API_BASE}${endpoint}`,{
      method:"GET",
      signal:controller.signal,
      ...options,
      headers:{
        ...(options.body instanceof FormData ? {} : {"Content-Type":"application/json"}),
        ...(options.headers||{})
      }
    });

    clearTimeout(timer);
    const data = await parse(response);

    if(!response.ok){
      throw new ApiError(data.message || "Request failed", response.status, data.details);
    }

    return data;
  }catch(err){
    clearTimeout(timer);

    if(err.name==="AbortError"){
      throw new ApiError("Request timeout",408);
    }

    if(err instanceof ApiError) throw err;

    throw new ApiError("Unable to connect to server.",500);
  }
}

export const fetchProjects=()=>request("/projects?featured=true").then(r=>r.data);
export const fetchProject=(slug)=>request(`/projects/${slug}`).then(r=>r.data);
export const fetchProfile=()=>request("/profile").then(r=>r.data);
export const fetchServices=()=>request("/services").then(r=>r.data);
export const fetchTestimonials=()=>request("/testimonials").then(r=>r.data);

export const submitContact=(data)=>request("/contact",{
 method:"POST",
 body:JSON.stringify(data)
});

export const createProject=(data,token)=>request("/projects",{
 method:"POST",
 headers:adminHeaders(token),
 body:JSON.stringify(data)
});

export const updateProject=(slug,data,token)=>request(`/projects/${slug}`,{
 method:"PUT",
 headers:adminHeaders(token),
 body:JSON.stringify(data)
});

export const deleteProject=(slug,token)=>request(`/projects/${slug}`,{
 method:"DELETE",
 headers:adminHeaders(token)
});

export const updateProfile=(data,token)=>request("/profile",{
 method:"PUT",
 headers:adminHeaders(token),
 body:JSON.stringify(data)
});

export const uploadImage=(base64,token)=>request("/upload",{
 method:"POST",
 headers:adminHeaders(token),
 body:JSON.stringify({file:base64})
});

export const uploadFile=(file,token)=>{
 const form=new FormData();
 form.append("file",file);
 return request("/upload",{
   method:"POST",
   headers:adminHeaders(token),
   body:form
 });
};

export default {
 fetchProjects,
 fetchProject,
 fetchProfile,
 fetchServices,
 fetchTestimonials,
 submitContact,
 createProject,
 updateProject,
 deleteProject,
 updateProfile,
 uploadImage,
 uploadFile
};
