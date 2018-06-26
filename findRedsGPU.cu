/****
     File: findRedsGPU.cu
     Date: 5/15/2018
     By: John Lazzarini
     Compile: nvcc findRedsGPU.cu -o frgpu
     Run: ./findRedsGPU

****/

#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <cuda.h>

#define NUMPARTICLES 32768
#define NEIGHBORHOOD .05
#define THREADSPERBLOCK 64

void initPos(float *);
float findDistance(float *, int, int);
__device__ float findDistanceGPU(float *, int, int);
void dumpResults(int index[]);

__global__ void findRedsGPU(float *p, int *numI);

int main() {
   cudaEvent_t start, stop;
 float time;

 float *pos;
 int *numReds;

//  NUMPARTICLES = atoi(argv[1]);
//  THREADSPERBLOCK = atoi(argv[2]);

 pos = (float *) malloc(NUMPARTICLES * sizeof(int) * 4);
 numReds = (int *) malloc(NUMPARTICLES * sizeof(int));

 initPos(pos);

 // your code to allocate device arrays for pos and numReds go here
 float* gpuPos;
 int* gpuNumReds;

 cudaMalloc((void **)&gpuPos,  NUMPARTICLES * sizeof(int) * 4);
 cudaMalloc((void **)&gpuNumReds, NUMPARTICLES * sizeof(int));

 cudaMemcpy(gpuPos, pos, NUMPARTICLES * sizeof(int) * 4, cudaMemcpyHostToDevice);
 cudaMemcpy(gpuNumReds, numReds, NUMPARTICLES * sizeof(int), cudaMemcpyHostToDevice);


 // create timer events
 cudaEventCreate(&start);
 cudaEventCreate(&stop);

 cudaEventRecord(start, 0);

 /* invoke kernel findRedsGPU here */
 findRedsGPU<<<NUMPARTICLES/THREADSPERBLOCK, THREADSPERBLOCK>>>(gpuPos, gpuNumReds);

 cudaThreadSynchronize();

 // your code to copy results to numReds[] go here
//  cudaMemcpy(pos, gpuPos, posSize, cudaMemcpyDeviceToHost);
 cudaMemcpy(numReds, gpuNumReds, NUMPARTICLES * sizeof(int), cudaMemcpyDeviceToHost);


 cudaEventRecord(stop, 0);
 cudaEventSynchronize(stop);
 cudaEventElapsedTime(&time, start, stop);

 printf("Elapsed time = %f\n", time);

 dumpResults(numReds);
}

void initPos(float *p) {
  // your code for initializing pos goes here
  int i;
  int roll;
  for (i=0; i<NUMPARTICLES; i++) {
    p[i*4] = rand() / (float) RAND_MAX;
    p[i*4+1] = rand() / (float) RAND_MAX;
    p[i*4+2] = rand() / (float) RAND_MAX;
    roll = rand() % 3;
    if (roll == 0)
      p[i*4+3] = 0xff0000;
    else if (roll == 1)
      p[i*4+3] = 0x00ff00;
    else
      p[i*4+3] = 0x0000ff;
 }
}

__device__ float findDistanceGPU(float *p, int i, int j) {

  // your code for calculating distance for particle i and j
  float dx, dy, dz;

  dx = p[i*4] - p[j*4];
  dy = p[i*4+1] - p[j*4+1];
  dz = p[i*4+2] - p[j*4+2];

  return(sqrt(dx*dx + dy*dy + dz*dz));
}

__global__ void findRedsGPU(float *p, int *numI) {

  // your code for counting red particles goes here
  int i;
  int particle = blockDim.x * blockIdx.x + threadIdx.x;
  float distance;
  numI[particle] = 0;

  for (i=0; i<NUMPARTICLES; i++) {
      if (i!=particle) {
        /* calculate distance between particles i, j */
        distance = findDistanceGPU(p, i, particle);
        /* if distance < r and color is red, increment count */
        if (distance < NEIGHBORHOOD && p[i*4+3] == 0xff0000) {
          numI[particle]++;
        }
      }
  }
}


void dumpResults(int index[]) {
  int i;
  FILE *fp;

  fp = fopen("./dump.out", "w");

  for (i=0; i<NUMPARTICLES; i++) {
    fprintf(fp, "%d %d\n", i, index[i]);
  }

  fclose(fp);
}